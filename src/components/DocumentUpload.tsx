import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, FileText, Trash2, CheckCircle, Clock, XCircle, Loader2, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DOCUMENT_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "cv", label: "CV / Resume" },
  { value: "qualification", label: "Qualification / Degree" },
  { value: "photo", label: "Passport Photo" },
  { value: "cover_letter", label: "Cover Letter" },
  { value: "reference_letter", label: "Reference Letter" },
  { value: "financial_proof", label: "Financial Proof" },
  { value: "other", label: "Other" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending Review", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

interface RequiredDoc {
  name: string;
  required: boolean;
}

interface DocumentUploadProps {
  applicationId: string;
  userId: string;
  destinationCountry?: string | null;
  applicationType?: string | null;
}

export function DocumentUpload({ applicationId, userId, destinationCountry, applicationType }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("passport");
  const [dragOver, setDragOver] = useState(false);
  const [requiredDocs, setRequiredDocs] = useState<RequiredDoc[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("application_id", applicationId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setDocuments(data || []);
    } catch {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  // Fetch required documents from matching program
  useEffect(() => {
    async function fetchRequiredDocs() {
      if (!destinationCountry && !applicationType) return;
      let query = supabase
        .from("programs")
        .select("required_documents")
        .eq("status", "active");
      if (destinationCountry) query = query.eq("country", destinationCountry);
      if (applicationType) query = query.eq("visa_type", applicationType);
      const { data } = await query.limit(1).maybeSingle();
      if (data?.required_documents && Array.isArray(data.required_documents)) {
        setRequiredDocs(data.required_documents as unknown as RequiredDoc[]);
      }
    }
    fetchRequiredDocs();
  }, [destinationCountry, applicationType]);

  useEffect(() => { loadDocuments(); }, [loadDocuments]);

  async function uploadFile(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("File type not allowed. Use PDF, JPG, PNG, or DOCX.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${userId}/${applicationId}/${docType}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("applicant-documents")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("documents").insert({
        application_id: applicationId,
        user_id: userId,
        document_type: docType,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
      } as any);
      if (dbError) throw dbError;

      toast.success("Document uploaded successfully");
      loadDocuments();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function deleteDocument(doc: any) {
    try {
      await supabase.storage.from("applicant-documents").remove([doc.file_path]);
      const { error } = await supabase.from("documents").delete().eq("id", doc.id);
      if (error) throw error;
      toast.success("Document deleted");
      loadDocuments();
    } catch {
      toast.error("Failed to delete");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Check which required docs have been uploaded
  function isDocUploaded(docName: string): boolean {
    const lower = docName.toLowerCase();
    return documents.some((d) => {
      const typeLower = (d.document_type || "").toLowerCase();
      const nameLower = (d.file_name || "").toLowerCase();
      return typeLower.includes(lower) || nameLower.includes(lower) || lower.includes(typeLower);
    });
  }

  const uploadedCount = requiredDocs.filter((d) => isDocUploaded(d.name)).length;
  const requiredCount = requiredDocs.filter((d) => d.required).length;
  const requiredUploaded = requiredDocs.filter((d) => d.required && isDocUploaded(d.name)).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" /> Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Required Documents Checklist */}
        {requiredDocs.length > 0 && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Required Documents</p>
              </div>
              <Badge variant={requiredUploaded >= requiredCount ? "default" : "secondary"} className="text-xs">
                {uploadedCount}/{requiredDocs.length} uploaded
              </Badge>
            </div>
            <div className="space-y-1.5">
              {requiredDocs.map((doc, i) => {
                const uploaded = isDocUploaded(doc.name);
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs",
                      uploaded
                        ? "border-green-500 bg-green-100 text-green-700"
                        : "border-border bg-background text-muted-foreground"
                    )}>
                      {uploaded ? <CheckCircle className="h-3.5 w-3.5" /> : <span className="text-[10px]">{i + 1}</span>}
                    </div>
                    <span className={cn("text-sm", uploaded && "text-muted-foreground line-through")}>{doc.name}</span>
                    {doc.required && !uploaded && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">Required</Badge>
                    )}
                    {!doc.required && !uploaded && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">Optional</Badge>
                    )}
                  </div>
                );
              })}
            </div>
            {requiredUploaded < requiredCount && (
              <p className="mt-3 text-xs text-amber-600 font-medium">
                ⚠ {requiredCount - requiredUploaded} required document{requiredCount - requiredUploaded > 1 ? "s" : ""} still needed
              </p>
            )}
            {requiredUploaded >= requiredCount && requiredCount > 0 && (
              <p className="mt-3 text-xs text-green-600 font-medium">
                ✓ All required documents uploaded
              </p>
            )}
          </div>
        )}

        {/* Upload area */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Document Type</label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            uploading && "pointer-events-none opacity-60"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="mt-2 text-sm font-medium">{uploading ? "Uploading…" : "Drop file here or click to browse"}</p>
          <p className="text-xs text-muted-foreground">PDF, JPG, PNG, DOCX — Max 10MB</p>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }}
          />
        </div>

        {/* Document list */}
        {loading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : documents.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => {
              const statusConf = STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusConf.icon;
              const typeLabel = DOCUMENT_TYPES.find((t) => t.value === doc.document_type)?.label || doc.document_type;

              return (
                <div key={doc.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <FileText className="h-8 w-8 shrink-0 text-muted-foreground/50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.file_name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs">{typeLabel}</Badge>
                      <span className="text-xs text-muted-foreground">{formatSize(doc.file_size)}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${statusConf.color}`}>
                        <StatusIcon className="h-3 w-3" /> {statusConf.label}
                      </span>
                    </div>
                    {doc.admin_notes && doc.status === "rejected" && (
                      <p className="mt-1 text-xs text-red-600">Note: {doc.admin_notes}</p>
                    )}
                  </div>
                  {doc.status === "pending" && (
                    <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteDocument(doc)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

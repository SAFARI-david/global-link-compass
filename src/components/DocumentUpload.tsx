import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Trash2, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

interface DocumentUploadProps {
  applicationId: string;
  userId: string;
}

export function DocumentUpload({ applicationId, userId }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("passport");
  const [dragOver, setDragOver] = useState(false);
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

  useState(() => { loadDocuments(); });

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" /> Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
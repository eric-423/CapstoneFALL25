import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase credentials are not defined. Please check your env."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type UploadParams = {
  bucket: string;
  file: File | Blob;
  fileName?: string;
  folder?: string;
};

export async function uploadMediaToSupabase({
  bucket,
  file,
  fileName,
  folder = "uploads",
}: UploadParams) {
  const extension =
    file instanceof File && file.name.includes(".")
      ? file.name.split(".").pop()
      : file.type.split("/").pop();

  const safeName =
    fileName ||
    `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}${
      extension ? `.${extension}` : ""
    }`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(safeName, file, {
      upsert: false,
      cacheControl: "0",
      contentType: file.type,
    });

  if (error) {
    if (
      error.message?.includes("Bucket not found") ||
      error.message?.includes("not found")
    ) {
      const customError = new Error(
        `Bucket "${bucket}" không tồn tại trong Supabase Storage. Vui lòng tạo bucket này trong Supabase Dashboard (Storage > Buckets) hoặc kiểm tra tên bucket trong biến môi trường NEXT_PUBLIC_SUPABASE_PRODUCT_BUCKET.`
      ) as Error & { originalError?: unknown };
      customError.originalError = error;
      throw customError;
    }
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl,
  };
}

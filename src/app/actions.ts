"use server";

import { analyzeImage } from "@/lib/ai";
import { createReport, getReportById, getReports, Report } from "@/lib/store";
import { revalidatePath } from "next/cache";

export async function processImageAction(base64Image: string) {
  try {
    const analysis = await analyzeImage(base64Image);
    return { success: true, data: analysis };
  } catch {
    return { success: false, error: "Failed to analyze image" };
  }
}

export async function submitReportAction(reportData: Omit<Report, 'id' | 'created_at' | 'status'>) {
  try {
    const report = await createReport(reportData);
    revalidatePath("/dashboard");
    return { success: true, data: report };
  } catch {
    return { success: false, error: "Failed to submit report" };
  }
}

export async function fetchReportsAction() {
  return await getReports();
}

export async function fetchReportByIdAction(id: string) {
  return await getReportById(id);
}

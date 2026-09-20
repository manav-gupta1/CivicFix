// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function analyzeImage(_imageUrlOrBase64: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Simulated AI response
  return {
    category: "waste",
    severity: "high",
    title: "Accumulated waste near roadside",
    description: "A large accumulation of mixed waste is visible along the roadside.",
    recommended_action: "Request municipal waste collection and cleanup.",
    confidence: 0.94
  };
}

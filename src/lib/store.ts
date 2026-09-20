export interface Report {
  id: string;
  created_at: string;
  title: string;
  category: 'waste' | 'pothole' | 'road_damage' | 'streetlight' | 'drainage' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommended_action: string;
  confidence: number;
  image_url: string;
  location_text: string;
  latitude?: number;
  longitude?: number;
  status: 'submitted' | 'assigned' | 'in_progress' | 'resolved';
}

const seedReports: Report[] = [
  {
    id: "CF-8A42F",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Roadside garbage accumulation",
    category: "waste",
    severity: "high",
    description: "A significant accumulation of mixed waste is visible beside the road.",
    recommended_action: "Request municipal waste collection and cleanup.",
    confidence: 0.94,
    image_url: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=800",
    location_text: "Yamuna Vihar, Delhi",
    status: "in_progress"
  },
  {
    id: "CF-10480",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Large pothole on main road",
    category: "pothole",
    severity: "high",
    description: "Deep pothole spanning across half the lane, dangerous for two-wheelers.",
    recommended_action: "Dispatch road maintenance crew for immediate fill.",
    confidence: 0.98,
    image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    location_text: "Connaught Place, Delhi",
    status: "resolved"
  },
  {
    id: "CF-10481",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Overflowing garbage bin",
    category: "waste",
    severity: "medium",
    description: "Municipal bin is overflowing, waste scattered across the pavement.",
    recommended_action: "Schedule immediate waste collection truck.",
    confidence: 0.91,
    image_url: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=800",
    location_text: "Lajpat Nagar, Delhi",
    status: "in_progress"
  },
  {
    id: "CF-10482",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    title: "Broken streetlight",
    category: "streetlight",
    severity: "high",
    description: "Streetlight is completely shattered and hanging by a wire.",
    recommended_action: "Send electrical maintenance team to repair or replace.",
    confidence: 0.89,
    image_url: "https://images.unsplash.com/photo-1542453673-95710ea1610e?auto=format&fit=crop&q=80&w=800",
    location_text: "Saket, Delhi",
    status: "submitted"
  }
];

const globalForStore = globalThis as unknown as {
  reports: Report[] | undefined;
};

const storeReports = globalForStore.reports ?? [...seedReports];
if (process.env.NODE_ENV !== 'production') globalForStore.reports = storeReports;

export async function getReports(): Promise<Report[]> {
  return [...storeReports].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getReportById(id: string): Promise<Report | undefined> {
  return storeReports.find(r => r.id === id);
}

export async function createReport(reportData: Omit<Report, 'id' | 'created_at' | 'status'>): Promise<Report> {
  const newReport: Report = {
    ...reportData,
    id: `CF-${Math.random().toString(16).substring(2, 7).toUpperCase()}`,
    created_at: new Date().toISOString(),
    status: 'submitted'
  };
  
  storeReports.push(newReport);
  return newReport;
}

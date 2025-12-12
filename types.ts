export interface VisaRecord {
  country: string;
  visa_status: string; // 'approved' | 'pending' | 'rejected' | etc.
}

export interface PassportData {
  passport_number: string;
  country: string;
  visa_records: VisaRecord[];
  travel_history: string[];
}

export interface VisaDetail {
  country: string;
  status: string;
}

export interface PassportCheckResponse {
  total_visas: number;
  visited_countries: number;
  visa_details: VisaDetail[];
  visited_details: string[];
}

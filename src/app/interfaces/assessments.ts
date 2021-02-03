export interface Assessment {
  id: number;
}

export interface AssessmentQuestion {
  id: string | number;
  description?: string;
  title: string;
  order: number;
  options: QuestionOption[];
}

export interface QuestionOption {
  title: string;
  description?: string;
  value: number | string;
  icon?: string;
  order?: number;
  isPremium?: boolean;
  is_selected?: boolean;
}

export type StateColors = 'dark' | 'danger' | 'warning';

export interface ErrorFormat {
    status: number;
    list: ErrorList;
}

export interface ErrorList {
    [key: string]: string[];
}

export interface ReportFormat {
    status: number;
    url: string;
    message: string;
    content: string;
}

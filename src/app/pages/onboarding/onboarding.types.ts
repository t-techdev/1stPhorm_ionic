type nextCallable = (value: string) => string;

export type QuestionFlow = StaticQuestion | DynamicQuestion;

interface StaticQuestion {
  id: string;
  prev?: string;
  next: string;
}

interface DynamicQuestion {
  id: string;
  prev?: string;
  next: nextCallable;
}

export type TRule = "require" | "address" | "numeric"

export interface IInputFunction{
    fieldname: string;
    name: string;
    placeholder?: string;
    type: 'text' | 'numeric' | 'object' | 'address';
    copy?: boolean;
    rule?: TRule
}

export interface IOutputFunction{
    fieldname: string;
    name: string;
    placeholder?: string;
    type: 'text' | 'object';
    copy?: boolean;
    view?: boolean;
}
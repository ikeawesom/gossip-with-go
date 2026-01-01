export interface ResponseType {
    message: string;
    success: boolean;
    data?: any;
    error?: any;
}

export interface StateTriggerType {
    trigger: React.Dispatch<React.SetStateAction<boolean>>;
    triggerBool: boolean;
}
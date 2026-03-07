export default interface Field {
    title: string;
    description?: string;
    fieldType: 'SINGLE-LINE' | 'MULTI-LINE' | 'NUMERIC' | 'BOOL';
    display: boolean;
    slot: Number;
}
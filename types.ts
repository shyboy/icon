
export interface Avatar {
    id: number;
    name: string;
    imageUrl: string;
    bgColor: string;
}

export interface GenerateFormState {
    image: File | null;
    text: string;
    position: string;
}

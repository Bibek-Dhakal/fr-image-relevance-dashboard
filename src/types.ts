export interface Image {
    id: string;
    url: string;
    status: string;
    subject: string | null;
    category: string | null;
    attributes: string[] | null;
    caption: string | null;
    confidence: number | null;
    error_message: string | null;
    created_at: string;
}

export interface MatchSuggestion {
    post_id: string;
    image_id: string | null;
    status: string;
    reason: string;
    similarity_score: number | null;
    image_url: string | null;
    image_tags: Record<string, any> | null;
}

export interface Review {
    id: string;
    post_id: string;
    image_id: string | null;
    similarity_score: number | null;
    ai_status: string;
    ai_reason: string | null;
    human_status: string | null;
    created_at: string;
}
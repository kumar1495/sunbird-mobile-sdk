export class ContentAccess {
    status: number;
    contentId: string;
    contentType: string;
    contentLearnerState: ContentLearnerState;
}

export interface ContentLearnerState {
    learnerState: { [key: string]: any };
}

export enum ContentAccessStatus {
    NOT_PLAYED = 0,
    PLAYED = 1
}

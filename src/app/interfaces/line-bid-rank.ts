export interface LineBidRank {
    BidPatternInventoriesId: number,
    Pattern: string,
    PeriodsId?: number,
    AddedDateTimeUTC?: string,
    UpdatedDateTimeUTC?: string | null,
    originalOrder?: number | 0;
    isSelected?: boolean | false;
};
namespace SportsIQ.Domain.FilterOptions;

public class PlayerFilterOptions
{
    public bool IncludeRatings { get; set; } = false;
    public int? SportID { get; set; }
    public IEnumerable<int>? TeamIDs { get; set; }
    public string? Position { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = false;
    public bool IncludePagination { get; set; } = true;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 25;
}
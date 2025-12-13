using SportsIQ.Domain.Core.Enums;

namespace SportsIQ.Domain.Core;

public class Filter
{
    public Filter(string key, string label, IEnumerable<FilterOption> options, bool isMultiple, FilterLocation location = FilterLocation.Side)
    {
        Key = key;
        Label = label;
        Options = options;
        IsMultiple = isMultiple;
        Location = location;
    }

    public string Key { get; set; }
    public string Label { get; set; }
    public IEnumerable<FilterOption> Options { get; set; }
    public bool IsMultiple { get; set;}
    public FilterLocation Location { get; set; }
}

public class FilterOption
{
    public FilterOption(int value, string label, bool isSelected = false, object data = null)
    {
        Value = value;
        Label = label;
        IsSelected = isSelected;
        Data = data;
    }

    public int Value { get; set; }
    public string Label { get; set; }
    public bool IsSelected { get; set; }
    public object Data { get; set; }
}
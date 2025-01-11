package co.com.savia.model.report.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Categories {
    private List<String> nullRules;
    private List<String> notNullRules;
    private List<VariableTypeRule> variableTypeRules;
    private List<SizeRule> sizeRules;
    private List<MinMaxRule> minimumAndMaximumRules;
    private List<String> duplicationRules;
    private List<ComparisonWithOtherColumnRule> comparisonsWithOtherColumnRules;
    private List<DateComparisonRule> comparisonsWithDateRules;
    private List<OrderColumnRule> orderColumnsRules;
    private List<RangeWithWordRule> rangeWithWordRules;
    private List<DateRangeRule> dateRangeRules;
    private List<SpecificValuesRule> specificValuesRules;
    private List<ConditionalNonNullRule> conditionalNonNullRules;
    private List<ConditionalNonNullInColumnsRule> conditionalNonNullInColumnsspecificRules;
}

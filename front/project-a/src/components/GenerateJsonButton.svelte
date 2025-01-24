<script>
  import { rulesStore } from '../stores/rulesStores.js';
  import { get } from 'svelte/store';

  function generateAndLogJson() {
    const currentRules = get(rulesStore);
    
    const finalJson = {
      rules: {
        categories: {
          nullRules: currentRules.rules.categories?.nullRules || [],
          notNullRules: currentRules.rules.categories?.notNullRules || [],
          variableTypeRules: currentRules.rules.categories?.variableTypeRules?.map(rule => ({
            name: rule.name,
            type: rule.type
          })) || [],
          sizeRules: currentRules.rules.categories?.sizeRules?.map(rule => ({
            name: rule.name,
            size: rule.size
          })) || [],
          minimumAndMaximumRules: currentRules.rules.categories?.minimumAndMaximumRules?.map(rule => ({
            name: rule.name,
            minValue: rule.minValue,
            maxValue: rule.maxValue
          })) || [],
          duplicationRules: currentRules.rules.categories?.duplicationRules || [],
          comparisonsWithOtherColumnRules: currentRules.rules.categories?.comparisonsWithOtherColumnRules?.map(rule => ({
            comparetorOne: rule.comparetorOne,
            comparetorTwo: rule.comparetorTwo,
            operator: rule.operator
          })) || [],
          comparisonsWithDateRules: currentRules.rules.categories?.comparisonsWithDateRules?.map(rule => ({
            comparetorOne: rule.comparetorOne,
            comparetorTwo: rule.comparetorTwo,
            operator: rule.operator
          })) || [],
          orderColumnsRules: currentRules.rules.categories?.orderColumnsRules?.map(rule => ({
            columns: rule.columns,
            orderType: rule.orderType
          })) || [],
          rangeWithWordRules: currentRules.rules.categories?.rangeWithWordRules?.map(rule => ({
            rangeColumn: rule.rangeColumn,
            ranges: rule.ranges.map(range => ({
              min: range.min,
              max: range.max,
              type: range.type
            })),
            typeColumn: rule.typeColumn
          })) || [],
          dateRangeRules: currentRules.rules.categories?.dateRangeRules?.map(rule => ({
            startDateColumn: rule.startDateColumn,
            endDateColumn: rule.endDateColumn,
            referenceDateColumn: rule.referenceDateColumn
          })) || [],
          specificValuesRules: currentRules.rules.categories?.specificValuesRules || [],
          conditionalNonNullRules: currentRules.rules.categories?.conditionalNonNullRules || []
        },
        dictionaries: currentRules.rules.dictionaries || []
      },
      report: {
        headers: currentRules.report?.headers || []
      }
    };

    console.log('JSON Final:', JSON.stringify(finalJson, null, 2));
    
    // Create and trigger download
    const blob = new Blob([JSON.stringify(finalJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rules.json';
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<button
  on:click={generateAndLogJson}
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  type="button"
>
  Generar y Descargar JSON
</button>
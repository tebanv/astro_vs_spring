<script>
  import CompareColumnsCard from './CompareColumnsCard.svelte';
  import HeaderTypeAssociation from './HeaderTypeAssociation.svelte';
  import ColumnsOrder from './ColumnsOrder.svelte';
  import RangeWithWord from './RangeWithWord.svelte';
  import DateRangeRules from './DateRangeRules.svelte';
  import SizeRules from './SizeRules.svelte';
  import MinimumAndMaximum from './MinimumAndMaximum.svelte';
  import NullRules from './NullRules.svelte';
  import NotNullRules from './NotNullRules.svelte';
  import SpecificValuesRules from './SpecificValuesRules.svelte';
  import ConditionalNonNullRules from './ConditionalNonNullRules.svelte';
  import Dictionaries from './Dictionaries.svelte';
  
  import DuplicationRules from './DuplicationRules.svelte';
  import CompareDatesCard from './CompareDatesCard.svelte';

  // import NotNullRulesTest from './NotNullRulesTest.svelte';

</script>

<div class="space-y-6">
  <div class=" space-y-4">
    <NullRules /> 
    <NotNullRules /> 
    <HeaderTypeAssociation /> 
    <SizeRules /> 
    <DuplicationRules /> 
    <Dictionaries /> 
    <RangeWithWord /> 
    <CompareColumnsCard /> 
    <MinimumAndMaximum /> 
    <ColumnsOrder /> 
    <CompareDatesCard /> 
    <DateRangeRules /> 
    <SpecificValuesRules /> 
    <ConditionalNonNullRules /> 
    
    
    <!-- <NotNullRulesTest />    -->

  </div>

</div>
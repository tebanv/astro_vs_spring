export function transformJsonForBackend(state) {
    const transformedState = JSON.parse(JSON.stringify(state));
    
    // Transform variableTypeRules
    if (transformedState.categories?.variableTypeRules) {
        transformedState.categories.variableTypeRules = transformedState.categories.variableTypeRules.map(rule => ({
            name: rule.header,
            type: rule.type
        }));
    }

    // Transform sizeRules
    if (transformedState.categories?.sizeRules) {
        transformedState.categories.sizeRules = transformedState.categories.sizeRules.map(rule => ({
            name: rule.header,
            size: rule.size
        }));
    }

    // Transform minimumAndMaximumRules
    if (transformedState.categories?.minimumAndMaximumRules) {
        transformedState.categories.minimumAndMaximumRules = transformedState.categories.minimumAndMaximumRules.map(rule => ({
            name: rule.header,
            minValue: rule.minValue,
            maxValue: rule.maxValue
        }));
    }

    // Transform comparisonsWithOtherColumnRules
    if (transformedState.categories?.comparisonsWithOtherColumnRules) {
        transformedState.categories.comparisonsWithOtherColumnRules = transformedState.categories.comparisonsWithOtherColumnRules.map(rule => ({
            comparetorOne: rule.header1,
            comparetorTwo: rule.header2,
            operator: rule.operator === '<' ? 'less_than' : rule.operator === '>' ? 'greater_than' : 'equal_to'
        }));
    }

    // Transform Dictionaries
    if (transformedState.rules?.dictionaries) {
        // Ensure names is an array
        if (!Array.isArray(transformedState.rules.dictionaries.names)) {
            transformedState.rules.dictionaries.names = [];
        }

        // Ensure numbers is an array
        if (!Array.isArray(transformedState.rules.dictionaries.numbers)) {
            transformedState.rules.dictionaries.numbers = [];
        }

        // Transform habits
        if (Array.isArray(transformedState.rules.dictionaries.habits)) {
            transformedState.rules.dictionaries.habits = transformedState.rules.dictionaries.habits.map(habit => ({
                columnNameHabit: habit.columnNameHabit,
                columnNameToCompare: habit.columnNameToCompare,
                habits: habit.habits.map(h => ({
                    habit: h.habit,
                    value: parseFloat(h.value)
                })),
                dictionaryName: habit.dictionaryName,
                columnNameInDictionary: habit.columnNameInDictionary
            }));
        } else {
            transformedState.rules.dictionaries.habits = [];
        }
    }

// Handle conditionalNonNullInColumnsspecificRules
if (transformedState.rules?.categories) {
    // Remove the empty array if it exists
    if (Array.isArray(transformedState.rules.categories.conditionalNonNullInColumnsspecificsRules)) {
        delete transformedState.rules.categories.conditionalNonNullInColumnsspecificsRules;
    }
    
    // Ensure the correct array is present
    if (!Array.isArray(transformedState.rules.categories.conditionalNonNullInColumnsspecificRules)) {
        transformedState.rules.categories.conditionalNonNullInColumnsspecificRules = [];
    }
}

return transformedState;
}

export function transformJsonFromBackend(state) {
    const transformedState = JSON.parse(JSON.stringify(state));
    
    // Transform variableTypeRules
    if (transformedState.categories?.variableTypeRules) {
        transformedState.categories.variableTypeRules = transformedState.categories.variableTypeRules.map(rule => ({
            header: rule.name,
            type: rule.type
        }));
    }

    // Transform sizeRules
    if (transformedState.categories?.sizeRules) {
        transformedState.categories.sizeRules = transformedState.categories.sizeRules.map(rule => ({
            header: rule.name,
            size: rule.size
        }));
    }

    // Transform minimumAndMaximumRules
    if (transformedState.categories?.minimumAndMaximumRules) {
        transformedState.categories.minimumAndMaximumRules = transformedState.categories.minimumAndMaximumRules.map(rule => ({
            header: rule.name,
            minValue: rule.minValue,
            maxValue: rule.maxValue
        }));
    }

    // Transform comparisonsWithOtherColumnRules
    if (transformedState.categories?.comparisonsWithOtherColumnRules) {
        transformedState.categories.comparisonsWithOtherColumnRules = transformedState.categories.comparisonsWithOtherColumnRules.map(rule => ({
            header1: rule.comparetorOne,
            header2: rule.comparetorTwo,
            operator: rule.operator === 'less_than' ? '<' : rule.operator === 'greater_than' ? '>' : '='
        }));
    }

    // Transform comparisonsWithDateRules 
    if (transformedState.rules.categories?.comparisonsWithDateRules) {
        transformedState.rules.categories.comparisonsWithDateRules = transformedState.rules.categories.comparisonsWithDateRules.map(rule => ({
            comparetorOne: rule.comparetorOne,
            comparetorTwo: rule.comparetorTwo,
            operator: rule.operator
        }));
    } else {
        transformedState.rules.categories.comparisonsWithDateRules = [];
    }

    // Transform Dictionaries
    if (transformedState.rules?.dictionaries) {
        // Ensure names is an array
        if (!Array.isArray(transformedState.rules.dictionaries.names)) {
            transformedState.rules.dictionaries.names = [];
        }

        // Ensure numbers is an array
        if (!Array.isArray(transformedState.rules.dictionaries.numbers)) {
            transformedState.rules.dictionaries.numbers = [];
        }

        // Transform habits
        if (Array.isArray(transformedState.rules.dictionaries.habits)) {
            transformedState.rules.dictionaries.habits = transformedState.rules.dictionaries.habits.map(habit => ({
                columnNameHabit: habit.columnNameHabit,
                columnNameToCompare: habit.columnNameToCompare,
                habits: habit.habits.map(h => ({
                    habit: h.habit,
                    value: parseFloat(h.value)
                })),
                dictionaryName: habit.dictionaryName,
                columnNameInDictionary: habit.columnNameInDictionary
            }));
        } else {
            transformedState.rules.dictionaries.habits = [];
        }
    }

// Handle conditionalNonNullInColumnsspecificRules
if (transformedState.rules?.categories) {
    // Remove the empty array if it exists
    if (Array.isArray(transformedState.rules.categories.conditionalNonNullInColumnsspecificsRules)) {
        delete transformedState.rules.categories.conditionalNonNullInColumnsspecificsRules;
    }
    
    // Ensure the correct array is present
    if (!Array.isArray(transformedState.rules.categories.conditionalNonNullInColumnsspecificRules)) {
        transformedState.rules.categories.conditionalNonNullInColumnsspecificRules = [];
    }
}

return transformedState;
}

export function transformJsonForAnalysis(state) {
    // Start with the backend transformation
    let transformedState = transformJsonForBackend(state);
    
    transformedState.metadata = {
        timestamp: new Date().toISOString(),
        version: "1.0"
    };
    
    // Ensure the structure matches exactly what the backend expects for analysis
    if (!transformedState.rules) {
        transformedState = { rules: transformedState };
    }
    
    return transformedState;
}
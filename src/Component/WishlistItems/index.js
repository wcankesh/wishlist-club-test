import {
    Box,
    IndexFilters,
    useSetIndexFiltersMode,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';

export default function SearchOnlyIndexTable({ setSearchValue, queryPlaceholder }) {
    const { mode, setMode } = useSetIndexFiltersMode();
    const [queryValue, setQueryValue] = useState('');
    const handleFiltersQueryChange = useCallback((value) => { setQueryValue(value); setSearchValue(value) }, []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleCancel = () => { setQueryValue(''); setSearchValue(''); };
    return (
        <Box maxWidth="100%" width="100%">
            <IndexFilters
                queryValue={queryValue}
                queryPlaceholder={queryPlaceholder}
                onQueryChange={handleFiltersQueryChange}
                onQueryClear={handleQueryValueRemove}
                onClearAll={handleQueryValueRemove}
                sortOptions={[]}
                sortSelected={[]}
                onSort={() => {}}
                filters={[]}
                appliedFilters={[]}
                tabs={[]}
                selected={0}
                onSelect={() => {}}
                mode={mode}
                setMode={setMode}
                cancelAction={{
                    onAction: handleCancel,
                    disabled: false,
                    loading: false,
                }}
            />
        </Box>
    );
}
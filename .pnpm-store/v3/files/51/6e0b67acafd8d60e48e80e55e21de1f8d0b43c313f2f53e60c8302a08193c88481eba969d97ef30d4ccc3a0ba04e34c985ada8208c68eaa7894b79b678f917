import PostgrestTransformBuilder from './PostgrestTransformBuilder';
import { GenericSchema } from './types';
declare type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'is' | 'in' | 'cs' | 'cd' | 'sl' | 'sr' | 'nxl' | 'nxr' | 'adj' | 'ov' | 'fts' | 'plfts' | 'phfts' | 'wfts';
export default class PostgrestFilterBuilder<Schema extends GenericSchema, Row extends Record<string, unknown>, Result> extends PostgrestTransformBuilder<Schema, Row, Result> {
    eq<ColumnName extends string & keyof Row>(column: ColumnName, value: Row[ColumnName]): this;
    eq(column: string, value: unknown): this;
    neq<ColumnName extends string & keyof Row>(column: ColumnName, value: Row[ColumnName]): this;
    neq(column: string, value: unknown): this;
    gt<ColumnName extends string & keyof Row>(column: ColumnName, value: Row[ColumnName]): this;
    gt(column: string, value: unknown): this;
    gte<ColumnName extends string & keyof Row>(column: ColumnName, value: Row[ColumnName]): this;
    gte(column: string, value: unknown): this;
    lt<ColumnName extends string & keyof Row>(column: ColumnName, value: Row[ColumnName]): this;
    lt(column: string, value: unknown): this;
    lte<ColumnName extends string & keyof Row>(column: ColumnName, value: Row[ColumnName]): this;
    lte(column: string, value: unknown): this;
    like<ColumnName extends string & keyof Row>(column: ColumnName, pattern: string): this;
    like(column: string, pattern: string): this;
    ilike<ColumnName extends string & keyof Row>(column: ColumnName, pattern: string): this;
    ilike(column: string, pattern: string): this;
    is<ColumnName extends string & keyof Row>(column: ColumnName, value: Row[ColumnName] & (boolean | null)): this;
    is(column: string, value: boolean | null): this;
    in<ColumnName extends string & keyof Row>(column: ColumnName, values: Row[ColumnName][]): this;
    in(column: string, values: unknown[]): this;
    contains<ColumnName extends string & keyof Row>(column: ColumnName, value: string | Row[ColumnName][] | Record<string, unknown>): this;
    contains(column: string, value: string | unknown[] | Record<string, unknown>): this;
    containedBy<ColumnName extends string & keyof Row>(column: ColumnName, value: string | Row[ColumnName][] | Record<string, unknown>): this;
    containedBy(column: string, value: string | unknown[] | Record<string, unknown>): this;
    rangeGt<ColumnName extends string & keyof Row>(column: ColumnName, range: string): this;
    rangeGt(column: string, range: string): this;
    rangeGte<ColumnName extends string & keyof Row>(column: ColumnName, range: string): this;
    rangeGte(column: string, range: string): this;
    rangeLt<ColumnName extends string & keyof Row>(column: ColumnName, range: string): this;
    rangeLt(column: string, range: string): this;
    rangeLte<ColumnName extends string & keyof Row>(column: ColumnName, range: string): this;
    rangeLte(column: string, range: string): this;
    rangeAdjacent<ColumnName extends string & keyof Row>(column: ColumnName, range: string): this;
    rangeAdjacent(column: string, range: string): this;
    overlaps<ColumnName extends string & keyof Row>(column: ColumnName, value: string | Row[ColumnName][]): this;
    overlaps(column: string, value: string | unknown[]): this;
    textSearch<ColumnName extends string & keyof Row>(column: ColumnName, query: string, options?: {
        config?: string;
        type?: 'plain' | 'phrase' | 'websearch';
    }): this;
    textSearch(column: string, query: string, options?: {
        config?: string;
        type?: 'plain' | 'phrase' | 'websearch';
    }): this;
    match<ColumnName extends string & keyof Row>(query: Record<ColumnName, Row[ColumnName]>): this;
    match(query: Record<string, unknown>): this;
    not<ColumnName extends string & keyof Row>(column: ColumnName, operator: FilterOperator, value: Row[ColumnName]): this;
    not(column: string, operator: string, value: unknown): this;
    /**
     * Match only rows which satisfy at least one of the filters.
     *
     * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
     * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
     * to make sure it's properly sanitized.
     *
     * It's currently not possible to do an `.or()` filter across multiple tables.
     *
     * @param filters - The filters to use, following PostgREST syntax
     * @param foreignTable - Set this to filter on foreign tables instead of the
     * current table
     */
    or(filters: string, { foreignTable }?: {
        foreignTable?: string;
    }): this;
    filter<ColumnName extends string & keyof Row>(column: ColumnName, operator: `${'' | 'not.'}${FilterOperator}`, value: unknown): this;
    filter(column: string, operator: string, value: unknown): this;
}
export {};
//# sourceMappingURL=PostgrestFilterBuilder.d.ts.map
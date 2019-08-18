/**
 * A controller for the qmExampleDataTable LWC
 */
public with sharing class QM_Example_LWC_DataTableController {
    /**
     * Gets a list of up to 50 Account records from the db
     *
     * @param sortedBy The field to sort the data by. Data will be sorted by Id if null.
     * @param sortedDirection Can be "asc" or "desc". Data is sorted by Id in ascending order if null.
     */
    @AuraEnabled
    public static List<Account> getTestData(String sortedBy, String sortedDirection) {
        if(String.isEmpty(sortedBy) || String.isEmpty(sortedDirection)) {
            return queryTestDataSortedById();
        } else {
            return queryTestDataSortedByAdditionalField(sortedBy, sortedDirection);
        }
    }

    /**
     * Gets up to an additional 25 Accounts from the db.
     * The lastId and lastValueOfSortedField parameters are used to determine the starting row offset of the returned dataset.
     *
     * @param sortedBy The API name of the field to sort by. Data will be sorted by Id if null
     * @param sortedDirection Can be "asc" or "desc". Data is sorted by Id in ascending order if null.
     * @param lastId The Id of the last row in the current dataset.
     * @param lastValueOfSortedField The value of the sortBy field in the last row of the current dataset.
     *                               Set to null if sorting by Id.
     * @param sortedFieldIsInteger Set to True if the sortBy field holds an integer, otherwise set to False.
     *                             This parameter is needed to work around an issue where the LWC sends us an
     *                             integer but Apex thinks it's a decimal
     */
    @AuraEnabled
    public static List<Account> getMoreTestData(String sortedBy, String sortedDirection, Id lastId, Object lastValueOfSortedField, Boolean sortedFieldIsInteger) {
        if(String.isEmpty(sortedBy) || String.isEmpty(sortedDirection)) {
            return queryMoreTestDataSortedById(lastId);
        } else {
            return queryMoreTestDataSortedByAdditionalField(sortedBy, sortedDirection, lastId, lastValueOfSortedField, sortedFieldIsInteger);
        }
    }

    /**
     * Gets the first 50 Account records in the DB sorted by Id
     */
    private static List<Account> queryTestDataSortedById() {
        return [
            SELECT Name, NumberOfEmployees
            FROM Account
            ORDER BY Id
            LIMIT 50
        ];
    }

    /**
     * Gets up to an additional 25 Accounts from the db sorted by Id.
     *
     * @param lastId The Id of the last row in the current dataset.
     *               Used to determine the starting row offset of the returned dataset.
     */
    private static List<Account> queryMoreTestDataSortedById(Id lastId) {
        return [
            SELECT Name, NumberOfEmployees
            FROM Account
            WHERE Id > :lastId
            ORDER BY Id
            LIMIT 25
        ];
    }

    /**
     * Gets up to 50 Account records sorted by a specified field and direction, from the db
     *
     * @param sortedBy The API name of the field to sort by
     * @param sortedDirection Can be "asc" or "desc".
     */
    private static List<Account> queryTestDataSortedByAdditionalField(String sortedBy, String sortedDirection) {
        String queryString =
            'SELECT Name, NumberOfEmployees '
          + 'FROM Account '
          + 'ORDER BY ' + sortedBy + ' ' + sortedDirection + ', Id '
          + 'LIMIT 50';

        return Database.query(queryString);
    }

    /**
     * Gets an additional 25 sorted Account records from the db.
     * The lastId and lastValueOfSortedField parameters are used to determine the starting row offset of the returned dataset.
     *
     * @param sortedBy The API name of the field to sort by.
     * @param sortedDirection Can be "asc" or "desc".
     * @param lastId The Id of the last row in the current dataset.
     * @param lastValueOfSortedField The value of the sortBy field in the last row of the current dataset.
     * @param sortedFieldIsInteger Set to True if the sortBy field holds an integer, otherwise set to False.
     *                             This parameter is needed to work around an issue where the LWC sends us an
     *                             integer but Apex thinks it's a decimal
     */
    private static List<Account> queryMoreTestDataSortedByAdditionalField(String sortedBy, String sortedDirection, Id lastId, Object lastValueOfSortedField, Boolean sortedFieldIsInteger) {
        String directionOperator = sortedDirection == 'asc' ? '>' : '<';

        // This hack is needed to avoid an issue where Integers sometimes come through as Decimals
        lastValueOfSortedField = sortedFieldIsInteger ? Integer.valueOf(lastValueOfSortedField) : lastValueOfSortedField;

        String queryString =
            'SELECT Name, NumberOfEmployees '
          + 'FROM Account '
          + 'WHERE ' + sortedBy + ' ' + directionOperator + ' :lastValueOfSortedField '
          +     'OR (' + sortedBy  + ' = :lastValueOfSortedField AND Id > :lastId) '
          + 'ORDER BY ' + sortedBy + ' ' + sortedDirection + ', Id LIMIT 25';

        return Database.query(queryString);
    }
}
/**
 * A controller for the qmExampleCreateTestData LWC
 */
public with sharing class QM_Example_LWC_CreateTestDataController {
    /**
     * Creates account records for use as test data
     */
    @AuraEnabled
    public static void createTestData(Integer numberOfRecordsToCreate) {
        List<Account> accountsToInsert = new List<Account>();

        for(Integer i = 1; i <= numberOfRecordsToCreate; i++) {
            accountsToInsert.add(new Account(
                    Name = 'Test Account #' + i,
                    AccountNumber = 'A' + String.valueOf(i).leftPad(7, '0')
            ));
        }

        insert accountsToInsert;
    }
}
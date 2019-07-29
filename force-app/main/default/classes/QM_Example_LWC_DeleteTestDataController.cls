/**
 * A controller for the qmExampleDeleteTestData LWC
 */
public with sharing class QM_Example_LWC_DeleteTestDataController {
    @AuraEnabled
    public static void deleteTestData() {
        delete [SELECT Id FROM Account];
    }
}
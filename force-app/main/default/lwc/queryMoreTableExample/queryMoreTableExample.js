/**
 * Created by danielzeidler on 2019-07-21.
 */

import {LightningElement, track} from 'lwc';
import createTestData from '@salesforce/apex/QM_Example_LWC_CreateTestDataController.createTestData';
import deleteTestData from '@salesforce/apex/QM_Example_LWC_DeleteTestDataController.deleteTestData';
import getTestData from '@salesforce/apex/QM_Example_LWC_DataTableController.getTestData';
import getMoreTestData from '@salesforce/apex/QM_Example_LWC_DataTableController.getMoreTestData';

export default class QueryMoreTableExample extends LightningElement {
    numberOfTestRecordsToCreate = 5;
    @track data;

    columns = [
        {label: 'Account Name', fieldName: 'Name', type: 'text'},
        {label: "Created Date", fieldName: 'CreatedDate', type: 'date'}
    ];

    connectedCallback() {
        getTestData().then(result => {
            // eslint-disable-next-line no-console
            console.log(result);
            this.data = result;
        });
    }

    //@wire(getTestData, {}) accounts;

    HandleCreateTestDataButtonPress() {
        createTestData({numberOfRecordsToCreate : this.numberOfTestRecordsToCreate}).then(() => {
            this._refreshData();
        });

    }

    handleNumberOfTestRecordsToCreate(event) {
        this.numberOfTestRecordsToCreate = event.target.value;
    }

    handleDeleteAllTestDataButtonPress() {
        deleteTestData().then(() => {
            this._refreshData();
        });
    }

    handleLoadMore(event) {
        // eslint-disable-next-line no-console
        console.log('loading more');
        const idOfLastRow = this.data[this.data.length - 1].Id;
        getMoreTestData({lastId: idOfLastRow})
            .then((newData) => {
                if(newData.length === 0) {
                    event.target.enableInfiniteLoading = false;
                } else {
                    this.data = this.data.concat(newData);
                }
            });
    }

    _refreshData() {
        //refreshApex(this.accounts);
    }

    // @wire(getTestData)
    // wiredTestData(provisionedValue) {
    //     this.provisionedValue = provisionedValue;
    //     this.data = provisionedValue.data;
    // }


}
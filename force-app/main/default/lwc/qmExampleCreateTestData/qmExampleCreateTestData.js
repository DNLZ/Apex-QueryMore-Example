/**
 * Interface to create test data (Accounts)
 */

import {LightningElement, track, wire} from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import createTestData from '@salesforce/apex/QM_Example_LWC_CreateTestDataController.createTestData';

export default class QmExampleCreateTestData extends LightningElement {
    @wire(CurrentPageReference) pageRef; // for pubsub

    @track loading = false; // used for spinner
    numberOfTestRecordsToCreate = 125;

    HandleCreateTestDataButtonPress() {
        this.loading = true;
        createTestData({numberOfRecordsToCreate : this.numberOfTestRecordsToCreate}).then(() => {
            this.loading = false;
            this._showSuccessToast();
            this._fireDataChangeEvent();
        });
    }

    handleNumberOfTestRecordsToCreate(event) {
        this.numberOfTestRecordsToCreate = event.target.value;
    }

    _fireDataChangeEvent() {
        fireEvent(this.pageRef, 'qm__testDataChange', {});
    }

    _showSuccessToast() {
        const event = new ShowToastEvent({
            title: 'Success!',
            message: `${this.numberOfTestRecordsToCreate} records inserted.`,
            variant: 'success'
        });
        this.dispatchEvent(event);
    }
}
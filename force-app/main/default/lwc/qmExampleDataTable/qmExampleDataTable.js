/**
 * Displays Account records with the ability to infinitely load additional records and sort by any column
 * Account data is synonymous with "test data" in this module
 */

import {LightningElement, track, wire} from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import getTestData from '@salesforce/apex/QM_Example_LWC_DataTableController.getTestData';
import getMoreTestData from '@salesforce/apex/QM_Example_LWC_DataTableController.getMoreTestData';

export default class QmExampleDataTable extends LightningElement {
    @wire(CurrentPageReference) pageRef; // for pubsub

    /** lightning-datatable properties **/
    @track data;
    @track columns = [
        {label: 'Account Name', fieldName: 'Name', type: 'text'},
        {label: 'Account Number', fieldName: 'AccountNumber', type: 'text'},
        {label: "Created Date", fieldName: 'CreatedDate', type: 'date'},
    ];
    @track sortedBy;
    @track sortedDirection;

    /** other properties **/
    @track loadingInProgress = false; // used for turning the spinner on and off
    @track moreDataAvailableToLoad = true;

    get isLoadMoreButtonEnabled() {
        return !this.moreDataAvailableToLoad;
    }

    connectedCallback() {
        this._registerTestDataChangeListener();
        this._refreshData();
    }

    disconnectedCallback() {
        unregisterAllListeners(this); // for pubsub
    }

    handleLoadMoreDataButtonClick() {
        this._loadMoreDataIntoTable();
    }

    handleEnableColumnSortCheckboxChange(event) {
        if(event.target.checked) {
            this._enableColumnSorting();
        } else {
            this._disableColumnSorting();
        }
    }

    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        this._refreshData();
    }

    _registerTestDataChangeListener() {
        registerListener(
            'qm__testDataChange',
            this._refreshData,
            this
        );
    }

    /**
     * Refreshes the table with new data from the server
     * @private
     */
    _refreshData() {
        this.loadingInProgress = true;
        this._fetchTestData().then((result) => {
            this.data = result;
            this.loadingInProgress = false;
            this.moreDataAvailableToLoad = true;
        });
    }

    /**
     * fetches a list test of data
     *
     * @return {Promise} - A Promise for the fetched data
     *
     * @private
     */
    _fetchTestData() {
        return getTestData({
            sortedBy: this.sortedBy,
            sortedDirection : this.sortedDirection
        });
    }

    /**
     * Appends additional test data to the table
     * @private
     */
    _loadMoreDataIntoTable() {
        this.loadingInProgress = true;

        this._fetchMoreTestData().then((newData) => {
            if(newData.length === 0) {
                // TODO: change criteria when this is set to false. Current criteria leads to bad UX
                this.moreDataAvailableToLoad = false;
            } else {
                this.data = this.data.concat(newData);
            }
            this.loadingInProgress = false;
        })
    }

    /**
     * Fetches additional data from the server
     *
     * @return {Promise} - A Promise for the additional data
     * @private
     */
    _fetchMoreTestData() {
        const lastRow = this.data[this.data.length - 1];

        return getMoreTestData({
            sortedBy: this.sortedBy,
            sortedDirection : this.sortedDirection,
            lastId: lastRow.Id,
            lastValueOfSortedField: lastRow[this.sortedBy]
        });
    }

    _enableColumnSorting() {
        this._setColumnSortableProperty(true);

        this.sortedBy = 'Name';
        this.sortedDirection =  'asc';

        this._refreshData();
    }

    _disableColumnSorting() {
        this._setColumnSortableProperty(false);

        this.sortedBy = null;
        this.sortedDirection =  null;

        this._refreshData();
    }

    /**
     * Sets all columns in the table and sortable or unsortable
     *
     * @param {boolean} isSortable - true if the columns should be sortable, false if not
     * @private
     */
    _setColumnSortableProperty(isSortable) {
        this.columns = this.columns.map((column) => {
            column.sortable = isSortable;
            return column
        });
    }
}
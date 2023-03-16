export class PageBondPolicyTemplate {
    pageSize: number = 25;
    // The total number of elements
    totalItems: number = 0;
    // The total number of pages
    totalPages: number = 0;
    // The current page number
    pageNumber: number = 0;
    status: string = '';
    keyword: string = '';
    isActive: boolean | string;

    getPageNumber() {
        return this.pageNumber + 1;
    }
}

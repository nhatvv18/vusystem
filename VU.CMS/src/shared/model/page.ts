export class Page {
    pageSize: number = 25;
    // The total number of elements
    totalItems: number = 0;
    // The total number of pages
    totalPages: number = 0;
    // The current page number
    pageNumber: number = 0;
    keyword: string = '';
    isActive: boolean | string;

    perPageOptions: Array<number> = [25, 50, 100, 200];

    getPageNumber() {
        return this.pageNumber + 1;
    }
}

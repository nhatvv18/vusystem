import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { CrudComponentBase } from '@shared/crud-component-base';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../layout/breadcrumb/breadcrumb.service';
import { TreeNode } from 'primeng/api';
import { DepartmentService } from '@shared/service-proxies/department-service';
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { CreateDepartmentComponent } from './create-department/create-department.component';
import { AddSalseDepartmentComponent } from './add-salse-department/add-salse-department.component';
import { AddSalseManagerDepartmentComponent } from './add-salse-manager-department/add-salse-manager-department.component';
import { AppConsts, DepartmentConst, FormNotificationConst, SaleConst, SearchConst } from '@shared/AppConsts';
import { debounceTime } from 'rxjs/operators';
import { FormSetDisplayColumnComponent } from '../form-set-display-column/form-set-display-column.component';
import { SaleService } from '@shared/service-proxies/sale-service';
import { Router } from '@angular/router';
import { OBJECT_INVESTOR_EKYC } from '@shared/base-object';
import { FormNotificationComponent } from '../form-notification/form-notification.component';
import { AddSaleDirectionalComponent } from './add-sale-directional/add-sale-directional.component';
import { BehaviorSubject, forkJoin } from 'rxjs';

const { DEFAULT_IMAGE } = OBJECT_INVESTOR_EKYC;

@Component({
    selector: 'app-department',
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.scss'],
    providers: [DialogService, ConfirmationService, MessageService],
})
export class DepartmentComponent extends CrudComponentBase {

    constructor(
        injector: Injector,
        messageService: MessageService,
        private breadcrumbService: BreadcrumbService,
        private dialogService: DialogService,
        private router: Router,
        private _departmentService: DepartmentService,
        private _dialogService: DialogService,
        private _saleService: SaleService,

    ) {
        super(injector, messageService);
        this.breadcrumbService.setItems([
            { label: 'Trang chủ', routerLink: ['/home'] },
            { label: 'Quản lý phòng ban' },
        ]);
    }

    dataTree: any[] = [];

    actions: any[] = [];

    departmentName: string;

    avatarDefault: any = DEFAULT_IMAGE.IMAGE_AVATAR;

    SaleConst = SaleConst;
    //
    rows: any[] = [];
    col: any;

    cols: any[];
    _selectedColumns: any[];
    listAction: any[] = [];
    listActionSale: any[] = [];

    //
    dataFilter = {
        field: null,
        departmentId: 0,
        customerType: null,
        saleType: null,
        status: null,
        area: null,
    }

    saleTypes: any[] = [];
    sources: any[] = [];
    statuses: any[] = [];
    customerType: any[] = [];

    departments = [];

    DepartmentConst = DepartmentConst;

    @ViewChild('divTreeDepartment', { static: false })
    divTreeDepartment: ElementRef<HTMLDivElement>;
    public valueZoomDivTreeDepart: number = 1;
    public detectChangeTreeDepartment: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(true);

    ngOnInit() {
        this.getDataTreeInit();
        this.dataTree =
            [
                {
                    "label": "Phòng ban",
                    "key": null,
                    "children": [{}]
                }
            ];

        //
        this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
            if (this.dataFilter.departmentId) {
                if (this.keyword === "") {
                    this.setPage({ page: this.offset });
                } else {
                    this.setPage(this.keyword);
                }
            }
        });

        //
        this.customerType = [
            {
              'code': '',
              'name': 'Tất cả'
            },
            ...SaleConst.customerTypes
        ]

        //
        this.saleTypes = [
            {
                'code': '',
                'name': 'Tất cả',
            },
            ...SaleConst.types
        ];

        //----
        this.statuses = [
            {
                'code': '',
                'name': 'Tất cả',
            },
            ...SaleConst.status
        ];

        this.cols = [
            { field: 'employeeCode', header: 'Mã nhân viên', width: '9rem', cutText: 'b-cut-text-10', isPin: true },
            { field: 'referralCodeDisplay', header: 'Mã giới thiệu', width: '9rem', cutText: 'b-cut-text-10', isPin: true },
            { field: 'nameInvestorOrBusinessCustomer', header: 'Họ tên / Tên doanh nghiệp', width: '25rem', cutText: 'b-cut-text-25', isPin: true },
            { field: 'contractCodeDisplay', header: 'Mã hợp đồng', width: '10rem', cutText: 'b-cut-text-10' },
            { field: 'saleTypeName', header: 'Loại Sale', width: '10rem', cutText: 'b-cut-text-10' },
            { field: 'departmentName', header: 'Phòng ban', width: '10rem', cutText: 'b-cut-text-10' },
            // { field: 'phone', header: 'Số điện thoại', width: '10rem', cutText: 'b-cut-text-10' },
            // { field: 'idNoOrTaxCode', header: 'Số CMND / Mã số thuế', width: '10rem', cutText: 'b-cut-text-10' },
            // { field: 'dateOfBirth', header: 'Ngày sinh', width: '10rem', cutText: 'b-cut-text-10' },
            // { field: 'placeOfResidenceOrAddress', header: 'Địa chỉ', width: '20rem', cutText: 'b-cut-text-20' },
            { field: 'columnResize', header: '', type:'hidden' },
        ];

        this.cols = this.cols.map((item, index) => {
            item.position = index + 1;
            return item;
        })

        // this._selectedColumns = this.cols;
        this._selectedColumns = this.getLocalStorage('saleDepartment') ?? this.cols;

    }

    ngAfterViewInit() {
        this.detectChangeTreeDepartment.subscribe((res: any) => {
            if (res) {
                this.zoomDivTreeDepart();
            }
        })
    }

    genListActionSale(data = []) {
        
        this.listActionSale = data.map(sale => {
            const actions = [];
            //
            if (this.isGranted([this.PermissionCoreConst.CoreSaleActive_ThongTinSale])) {
                actions.push({
                    data: sale,
                    label: 'Thông tin chi tiết',
                    icon: 'pi pi-info-circle',
                    command: ($event) => {
                        this.detail($event.item.data);
                    }
                })
            }

            if (this.isGranted([this.PermissionCoreConst.CoreSaleActive_KichHoat])) {
                actions.push({
                    data: sale,
                    label: sale.status == SaleConst.STATUS_ACTIVE ? 'Khóa' : 'Kích hoạt',
                    icon: sale.status == SaleConst.STATUS_ACTIVE ? 'pi pi-times-circle' : 'pi pi pi-check',
                    command: ($event) => {
                        this.changeStatus($event.item.data);
                    }
                })
            }
            console.log('actions____', this.actions);
            
            return actions;
        });

        console.log('listAction______', this.listActionSale);
        
    }

    detail(sale) {
        let cryptEncodeId = encodeURIComponent(this.cryptEncode(sale?.saleId));  
		window.open('/sale-manager/sale-active/detail/' + (cryptEncodeId), "_blank");
    }

    changeStatus(sale) {
        this._saleService.changeStatus(sale.saleId).subscribe((response) => {
            if (this.handleResponseInterceptor(response, "Cập nhật thành công")) {
                this.setPage();
            }
        }, (err) => {
            console.log('err---', err);
            this.messageService.add({ severity: 'error', detail: 'Cập nhật thất bại. Vui lòng thử lại!', life: 3000 });
        });
    }

    // KHỞI TẠO LẤY RA CÁC PHÒNG BAN LV1
    getDataTreeInit() {
        this.isLoading = true;
        this._departmentService.getDepartmentChild().subscribe((res) => {
            this.isLoading = false;
            if (this.handleResponseInterceptor(res, '')) {
                console.log('DepartmentLv1', res);
                if (res?.data?.length) {
                    if (this.departments.length == 0){
                        this.departments = res?.data
                    }
                    
                    this.dataTree[0].children = this.hanldeNodeChildren(res?.data);
                    // Hiển thị sẵn danh sách các phòng ban lv 1
                    this.dataTree[0].expanded = true;
                }
            }
        }, (err) => {
            console.log('err----', err);
            this.isLoading = false;
            
        });
    }
    // TẠO ACTIONS THEO PHÒNG BAN CLICK
    genListActionInDepartment(node) {
        console.log('node___', node);
        this.actions = [];

        if (this.isGranted([this.PermissionCoreConst.CorePhongBan_ThemMoi])) {
            this.actions.push({
                label: 'Thêm phòng ban',
                icon: 'pi pi-plus-circle',
                data: node,
                command: ($event) => this.create($event.item.data)
            })
        }

        if (this.isGranted([this.PermissionCoreConst.CorePhongBan_ThemQuanLy])) {
            this.actions.push({
                label: 'Thêm quản lý',
                icon: 'pi pi-fw pi-plus-circle',
                data: node,
                command: () => this.addSaleManager(node)
            })
        }

        if (node?.data?.managerBusinessCustomer != null && this.isGranted([this.PermissionCoreConst.CorePhongBan_ThemQuanLyDoanhNghiep])) {
            this.actions.push({
                label: 'Thêm quản lý DN',
                icon: 'pi pi-fw pi-plus-circle',
                data: node,
                command: () => this.addSaleManager2(node)
            })
        }

        if (this.isGranted([this.PermissionCoreConst.CorePhongBan_CapNhat])) {
            this.actions.push({
                label: 'Sửa phòng ban',
                icon: 'pi pi-pencil',
                data: node,
                command: ($event) => this.edit($event.item.data),
            })
        }

        if (this.isGranted([this.PermissionCoreConst.CorePhongBan_Xoa])) {
            this.actions.push({ 
                label: 'Xóa phòng ban', 
                icon: 'pi pi-fw pi-trash', 
                data: node,
                command: ($event) => this.delete($event.item.data), 
            })
        }

        if (node?.data?.managerId != null) {
            this.actions.push({
                label: 'Xóa quản lý',
                icon: 'pi pi-fw pi-trash',
                data: node,
                command: () => this.deleteSaleManager(node, this.DepartmentConst.MANAGER_SALE_1)
            })
        }

        if (node?.data?.managerId2 != null) {
            this.actions.push({
                label: 'Xóa quản lý DN',
                icon: 'pi pi-fw pi-trash',
                data: node,
                command: () => this.deleteSaleManager(node, this.DepartmentConst.MANAGER_SALE_2)
            })
        }

        if (this.isGranted([this.PermissionCoreConst.CorePhongBan_ThemMoi])) {
            this.actions.push({
                label: 'Điều hướng',
                icon: 'pi pi-fast-forward',
                data: node,
                command: ($event) => this.directional($event.item.data)
            })
        }
    }

    directional(item) {
        this.dialogService.open(
            AddSaleDirectionalComponent, 
            {
                header: 'Điều hướng sale',
                width: '800px',
                footer: "",
                data: {
                    inputData: item
                },
            }).onClose.subscribe(result => {
            console.log('result_____', result);
            if(result) {
                this.setPage({ page: this.page.pageNumber });
                // zoom div tree department to fit screen
                this.detectChangeTreeDepartment.next(true);
            }
          }
        )
    }

    deleteSaleManager(node, type) {
        console.log('hey hey hey', node);
        
		const ref = this._dialogService.open(
            FormNotificationComponent,
            {
                header: "Thông báo",
                width: '600px',
                contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
                styleClass: 'p-dialog-custom',
                baseZIndex: 10000,
                data: {
                    title : "Bạn có chắc chắn xóa quản lý này?",
                    icon: FormNotificationConst.IMAGE_CLOSE,
                },
            }
        );
		ref.onClose.subscribe((dataCallBack) => {
            console.log({ dataCallBack });
			if (dataCallBack?.accept) {
                this._departmentService.deleteSaleManager(node?.data?.departmentId, type).subscribe((response) => {
                if (this.handleResponseInterceptor(response, "Xóa quản lý thành công")) {
                    console.log('nodeeee delete ____: ', node);
                    this._departmentService.getById(node.data.departmentId).subscribe((resDepartment) => {
                        if(this.handleResponseInterceptor(resDepartment, '')) {
                        node.data = resDepartment?.data;
                        // zoom div tree department to fit screen
                        this.detectChangeTreeDepartment.next(true);
                        }
                    });
                }
                });
			} 
		});
	}

    // XEM DANH SÁCH SALE THUỘC PHÒNG BAN
    getSales(node) {
        this.dataFilter.departmentId = node?.data?.departmentId;
        this.departmentName = node?.data?.departmentName;
        if (this.dataFilter.departmentId) {
            this.setPage();
        }
    }

    getLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key))
    }

    setLocalStorage(data) {
        return localStorage.setItem('saleDepartment', JSON.stringify(data));
    }

    setColumn(col, _selectedColumns) {
        console.log('cols:', col);

        console.log('_selectedColumns', _selectedColumns);

        const ref = this.dialogService.open(
            FormSetDisplayColumnComponent,
            this.getConfigDialogServiceDisplayTableColumn("Sửa cột hiển thị", col, _selectedColumns)
        );

        ref.onClose.subscribe((dataCallBack) => {
            console.log('dataCallBack', dataCallBack);
            if (dataCallBack?.accept) {
                this._selectedColumns = dataCallBack.data.sort(function (a, b) {
                    return a.position - b.position;
                });
                this.setLocalStorage(this._selectedColumns)
                console.log('Luu o local', this._selectedColumns);
            }
        });
    }

    showData(rows) {
        for (let row of rows) {
            row.nameInvestorOrBusinessCustomer = row?.investor ? row?.investor?.investorIdentification?.fullname : (row?.businessCustomer ? row?.businessCustomer?.name : null);
            row.referralCodeDisplay = row?.referralCode;
            row.contractCodeDisplay = row?.contractCode;
            row.saleTypeName = SaleConst.getInfoType(row.saleType, 'name'),
            row.phone = row?.investor?.phone,
            row.idNoOrTaxCode = row?.investor ? row?.investor?.investorIdentification?.idNo : (row?.businessCustomer ? row?.businessCustomer?.taxCode : null);
            row.dateOfBirth = this.formatDate(row?.investor?.investorIdentification?.dateOfBirth),
            row.placeOfResidenceOrAddress = row?.investor ? row?.investor?.investorIdentification?.placeOfResidence : (row?.businessCustomer ? row?.businessCustomer?.address : null);
        };
        console.log('showData', rows);
    }

    changeFieldFilter() {
        if (this.keyword?.trim()) {
            this.setPage();
        }
    }

    setPage(pageInfo?: any, updateListDepartmentFilter = true) {
        // this.setFieldError();
        this.page.pageNumber = pageInfo?.page ?? this.offset;
        if (pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
        this.page.keyword = this.keyword;
        this.isLoading = true;

        forkJoin([
            this._departmentService.getAllSaleDepartments(this.page, this.dataFilter), 
            this._departmentService.getAllDepartmentChild(this.dataFilter)
        ]).subscribe(([resSale, resDepartment]) => {
            this.isLoading = false;
            if (this.handleResponseInterceptor(resSale, '')) {
                this.page.totalItems = resSale.data?.totalItems;
                this.rows = resSale.data?.items;
                //
                if (this.rows?.length) {
                    this.genListActionSale(this.rows);
                    this.showData(this.rows);
                }

                console.log({ rows: resSale.data?.items });
            }
            //
            if (this.handleResponseInterceptor(resDepartment, '') && updateListDepartmentFilter) {
                this.departments = resDepartment?.data;
                console.log({ departments: this.departments });
            }
        }, (err) => {
            this.isLoading = false;
            console.log('Error-------', err);
        });
    }

    // THÊM PHÒNG BAN
    create(node?: any) {
        this.showDialogCreate(node);
    }

    showDialogCreate(node) {
        const ref = this.dialogService.open(
            CreateDepartmentComponent,
            {
                header: "Thêm phòng ban",
                width: '500px',
                contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px" },
                baseZIndex: 10000,
                data: {
                    department: {
                        departmentName: null,
                        departmentAddress: null,
                        parentId: node?.data?.departmentId ?? null,
                    },
                    parentInfo: node?.data,
                },
            }
        );

        ref.onClose.subscribe((department) => {
            console.log('department', department);
            // THÊM MỚI PHÒNG BAN CON LV > 2
            if (department?.parentId) {
                node.expanded = true;
                this.updateNode(node);
            }
            // THÊM MỚI PHÒNG BAN CHA LV1 
            else if (department) {
                this.dataTree[0].children.push({
                    "label": department.departmentName,
                    "data": department,
                    "key": department.departmentId,
                    "parentKeys": [],
                    "children": [{ "label": 'Phòng trống', "data": null }],
                });
            }
            // zoom div tree department to fit screen
            this.detectChangeTreeDepartment.next(true);
        });
    }

    // CẬP NHẬT LẠI DANH SÁCH PHÒNG BAN CON KHI THÊM MỚI PHÒNG BAN
    updateNode(node) {
        this._departmentService.getDepartmentChild(+node.key).subscribe((res) => {
            if (this.handleResponseInterceptor(res, '')) {
                if (res?.data?.length) {
                    node.data.hasDepartmentChild = true;
                    node.children = this.hanldeNodeChildren(res?.data, node);
                }
            }
        });
    }

    // SỬA PHÒNG BAN
    edit(node?: any) {
        this.showDialogEdit(node);
    }

    showDialogEdit(node) {
        console.log('nodeEdit', node);

        const ref = this.dialogService.open(
            CreateDepartmentComponent,
            {
                header: "Cập nhật phòng ban",
                width: '500px',
                contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px" },
                baseZIndex: 10000,
                data: {
                    department: { ...node.data },
                },
            }
        );

        ref.onClose.subscribe((departmentUpdate) => {
            console.log('departmentUpdate', departmentUpdate);
            if (departmentUpdate) {
                node.data = departmentUpdate;   
                this.getDataTreeInit()
                console.log('nodeUpdate', node);

            }
        });
    }

    // THÊM SALE VÀO PHÒNG BAN
    addSale(node) {
        this.showDialogAddSale(node);
    }

    showDialogAddSale(node) {
        const ref = this.dialogService.open(
            AddSalseDepartmentComponent,
            {
                header: node?.data?.departmentName,
                width: '400px',
                contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "65px" },
                baseZIndex: 10000,
                data: {
                    sale: {
                        saleId: null,
                        departmentId: node?.data?.departmentId,
                        position: null,
                    },
                    department: node?.data,
                },
            }
        );

        ref.onClose.subscribe((res) => {
            console.log('res', res);
        });
    }

    // THÊM SALE THÀNH QUẢN LÝ TRONG PHÒNG BAN
    addSaleManager(node) {
        this.showDialogAddSaleManager(node);
    }

    // THÊM SALE LÀ QUẢN LÝ CON NGƯỜI
    addSaleManager2(node){
        this.showDialogAddSaleManager(node, true);
    }

    showDialogAddSaleManager(node, isBusinessCustomer?: boolean) {
        const ref = this.dialogService.open(
            AddSalseManagerDepartmentComponent,
            {
                header: node?.data?.departmentName + ' - ' + "Thêm quản lý " + (isBusinessCustomer ? 'doanh nghiệp' : ''),
                width: '400px',
                contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "65px" },
                baseZIndex: 10000,
                data: {
                    saleManager: {
                        saleId: null,
                        departmentId: node?.data?.departmentId,
                    },
                    department: node?.data,
                    isBusinessCustomer: isBusinessCustomer
                },
            }
        );

        ref.onClose.subscribe((departmentUpdate) => {
            console.log('departmentUpdate', departmentUpdate);
            if (departmentUpdate) {
                node.data = departmentUpdate;
                console.log('nodeUpdate', node);
                // zoom div tree department to fit screen
                this.detectChangeTreeDepartment.next(true);
            }
        });
    }

    // SHOW RA CÁC PHÒNG BAN CON KHI CLICK VÀO PHÒNG BAN CHA
    showNode(event, node, handle?: boolean) {
        console.log('eventNode', node, this.dataTree);
        // Tính tỷ lệ màn hình để scroll sang phải gợi ý người dùng còn dữ liệu ---
        let screenRatio = 0;
        const x = event.clientX;
        if (x) screenRatio = (x / this.screenWidth) * 100;
        //----
        if (handle) node.expanded = !node.expanded;  // Bật tắt node khi ko dùng event có sẵn của tree Horizontal
        //
        if (node?.key && !node.children[0].data) {
            // this.isLoading = true;
            this._departmentService.getDepartmentChild(+node.key).subscribe((res) => {
                this.isLoading = false;
                if (this.handleResponseInterceptor(res, '')) {
                    if (res?.data?.length) {
                        node.children = this.hanldeNodeChildren(res?.data, node);
                    }
                }
                console.log('nodeChild___', node.children);
                
                this.callScrollRight(screenRatio, node.expanded);
            }, (err) => {
                this.isLoading = false;
            });
        } else {
            this.callScrollRight(screenRatio, node.expanded);
        }
        // zoom div tree department to fit screen
        this.detectChangeTreeDepartment.next(true);
    }

    hanldeNodeChildren(data, nodeParent?: any) {
        return data.map(nodeChild => {
            // XỬ LÝ VỚI NODE LỚN HƠN LV1 </START>
            let parentKeys = nodeParent?.parentKeys ? [...nodeParent.parentKeys] : [];
            if(nodeParent) parentKeys.push(nodeParent.key);
            // <END>
            const nodeHanlde = {
                "label": nodeChild.departmentName,
                "data": nodeChild,
                "key": nodeChild.departmentId,
                "parentKeys": parentKeys,
                "children": [],
            };
            // KHỞI TẠO PHÒNG BAN VỚI NODE CÓ PHÒNG BAN CON
            if(nodeChild.hasDepartmentChild) {
                nodeHanlde.children = [{ "label": "Loading...", "data": null }];
            }
            //
            return nodeHanlde;
        });
    }


    delete(node) {
        console.log('node___', node);
        
        if(!node.data?.hasDepartmentChild) {
            this._departmentService.delete(node.key).subscribe(res => {
                if(this.handleResponseInterceptor(res, 'Xóa thành công')) {
                    this.filterRemove(node.parentKeys, node, () => {
                        // zoom div tree department to fit screen
                        this.detectChangeTreeDepartment.next(true);
                    });
                }
            }, (err) => {
                console.log('err___', err);
                this.messageError('Không thể xóa vui lòng thử lại sau!', '');
            });
        } else {
            this.messageError('Vui lòng xóa các phòng ban bên trong trước!', ''); 
        }
        
    }

    filterRemove(parentKeys, node, callBack: Function) {
        let parentNode: any;

        // XOÁ PHÒNG BAN TỪ CẤP 2 TRỞ ĐI
        if(parentKeys?.length) {
            // CLICK NODE CON => TÌM KIẾM NODE CHA
            for(let parentKey of parentKeys) {
                if(!parentNode?.children?.length) {
                    parentNode = this.dataTree[0].children.find(item => item.key == parentKey);
                } else {
                    parentNode = parentNode.children.find(item => item.key == parentKey);
                } 
            }
            //
            let indexNode = parentNode.children.findIndex(n => n.key == node.key);
            parentNode.children.splice(indexNode, 1);

            // CHECK LẠI NODE CHA CÓ CÒN CON KHÔNG ĐỂ UPDATE TRƯỜNG hasDepartmentChild
            this.isLoading = true;
            this._departmentService.getDepartmentChild(+parentNode.key).subscribe((res) => {
                // this.isLoading = false;
                if (!res.data?.length) parentNode.data.hasDepartmentChild = false;
                console.log('RES___', res, parentNode);
            }, (err) => {
                this.isLoading = false;
            });

            // ĐÓNG NODE CHA KHI TẤT CẢ CÁC NODE CON BỊ XÓA
            if(parentNode?.children?.length == 0) {
                parentNode.expanded = false;
            }
        }
        // XÓA PHÒNG BAN CẤP 1 
        else {
            let indexNode = this.dataTree[0].children.findIndex(n => n.key == node.key);
            this.dataTree[0].children.splice(indexNode, 1);
        }
        callBack();
    }


    // AUTO SCROLL SANG PHẢI KHI DỮ LIỆU PHÒNG BAN SHOW RA BÊN PHẢI MÀN HÌNH BỊ CHE LẤP 
    callScrollRight(screenRatio, expanded) {
        console.log({ 'x-------': screenRatio, 'expanded----': expanded });
        // KHI CLICK Ở VỊ TRÍ > 80% MÀN HÌNH VÀ LÀ THAO TÁC MỞ NÚT THÌ MỚI GỌI SCROLL
        if (screenRatio > 80 && expanded) {
            setTimeout(() => {
                document.querySelector('.p-tree-horizontal').scrollBy(500, 0);
            }, 50);
        }
    };

    public zoomDivTreeDepart() {
        const screenHeight = window.innerHeight;
        const screenDivTreeDepart = this.divTreeDepartment.nativeElement.offsetHeight;
        if (screenDivTreeDepart > screenHeight) {
            this.valueZoomDivTreeDepart = Number((screenHeight / screenDivTreeDepart).toFixed(2));
        } else {
            this.valueZoomDivTreeDepart = 1;
        }
    }
}

import { Component, Injector, OnInit } from "@angular/core";
import { AppConsts } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { AppUtilsService } from "@shared/services/utils.service";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-upload-image",
  templateUrl: "./upload-image.component.html",
  styleUrls: ["./upload-image.component.scss"],
})
export class UploadImageComponent extends CrudComponentBase implements OnInit {
  uploadedFiles = [];
  isUploading: boolean = false;
  isImage: boolean = false;
  constructor(
    injector: Injector,
    messageService: MessageService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public appUtilsService: AppUtilsService
  ) {
    super(injector, messageService);
  }

  AppConsts = AppConsts;

  ngOnInit(): void {
    if (this.config.data) {
      this.isImage = !!this.config.data.isImage;
    }
  }

  public get accept() {
    return this.isImage ? "image/*" : "image/*,video/mp4,video/x-m4v,video/*";
  }

  onUpload(event) {
    if (event) {
      this.isUploading = true;
      let uploadFilesProcess = [];
      event.files.forEach((file) => {
        uploadFilesProcess.push(
          this.appUtilsService.uploadFileGetUrl(file, "media")
        );
      });
      forkJoin(uploadFilesProcess).subscribe(
        (results) => {
          this.uploadedFiles = results;

          this.isUploading = false;

          this.messageService.add({
            severity: "info",
            summary: "Ảnh đã được tải lên",
            detail: "",
          });
        },
        (error) => {
          this.isUploading = false;
          this.messageService.add({
            severity: "error",
            summary: "Có lỗi khi tải ảnh lên, vui lòng thử lại",
            detail: "",
          });
        }
      );
    }
  }

  removeFile(fileToDelete) {
    this.uploadedFiles = this.uploadedFiles.filter((fileItem) => {
      return fileItem.data !== fileToDelete.data;
    });
  }

  hideDialog() {
    this.ref.close();
  }

  save() {
    if (this.uploadedFiles.length > 0) {
      this.ref.close(this.uploadedFiles);
    }
  }
}

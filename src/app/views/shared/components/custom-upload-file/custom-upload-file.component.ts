import { Component, OnInit, Optional, Inject, Injector, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { AppComponentBase } from '../../app-component-base';
import { AppConst } from '../../AppConst';
import { FileSizePipe } from '../../pipes/non-negative/file-size/file-size.pipe';


@Component({
  selector: 'kt-custom-upload-file',
  templateUrl: './custom-upload-file.component.html',
  styleUrls: ['./custom-upload-file.component.scss'],
  providers: [FileSizePipe]
})

export class CustomUploadFileComponent extends AppComponentBase implements OnInit {

  //file upload
  fileName: string;
  fileError: string;
  file: File;
  //id: number;
  fileList: any = [];
  enviroment = environment
  //for Loading
  isLoading: boolean;
  private httpWithoutInterceptor: HttpClient;

   //for reset previous files
   @ViewChild('uploadFileInput') uploadFileInput: ElementRef;

  constructor(
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: { response: any, serviceClass: any, functionName: string, name: string , docType: string },
    public dialogRef: MatDialogRef<CustomUploadFileComponent>,
    private fileSizePipe: FileSizePipe,
    private httpClient: HttpClient,
    private httpBackend: HttpBackend,
    injector: Injector) {
    super(injector);
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  ngOnInit(): void {
    this.fileList = this.data.response.fileUploadList;
    console.log('fileList : ', this.fileList)
  }

  // upload file
  uploadFile(event: any) {
    // if (event.target.files) {
    //   Object.values(event.target.files).map((file: any) => {
    //     const size = Number(this.fileSizePipe.transform(file.size))
    //     this.fileError = (size > 5) ? 'File size exceeds maximum limit 5 MB.' : null
    //     if (this.fileError) {
    //       console.log(this.fileError)
    //       return false;
    //     }
    //     console.log("yes")
    //    this.fileList.push(file)
    //   })
    // }
    if (event.target.files) {
      this.file = event.target.files[0] as File;
      const size = Number(this.fileSizePipe.transform(this.file.size))
      this.fileError = (size > 5) ? 'File size exceeds maximum limit 5 MB.' : null
    }
  }

  // downloadFile(file){
  //   console.log("yes enteed")
  //     let params = new HttpParams();
  //     params = params.append("docType", file.docType);
  //   this.httpClient.get<any>(AppConst.remoteServiceBaseUrl + 'UploadDocument/' + file.id, { params: params }
  //   ).subscribe((res) => console.log('server response: ', new File([file], 'testFile')))
  // }

  onSubmit() {
    if (!this.file || this.fileError) {
      this.fileError = 'Please upload file.'
      return
    }
    this.isLoading = true;
    this.data.serviceClass[this.data.functionName](this.data.response.id, this.file, this.data?.docType).subscribe(() => {
      this.toastService.success("File Uploaded Successfully", this.data.name)
      this.isLoading = false;
      this.dialogRef.close()
    }, (err: any) => {
      //this.toastService.error("Something went wrong", 'Error')
    })
    // this.dialogRef.close({ file: this.file })
  }

  // reset(i : number) {
  //   this.fileList.map((_, index: number) => {
  //     if (index === i) {
  //       this.fileList.splice(i , 1)
  //     }
  //   });
  //   this.fileError = null
  // }

  reset() {
    this.uploadFileInput.nativeElement.value = '';
    this.file = null
    this.fileError = null
  }

  getFileUrl(file): string {
    return AppConst.remoteServiceBaseUrl + 'UploadDocument/' + file.id + '?docType=' + file.docType;
  }

  download(file: any) {
    console.log('download called');
    let fileUrl = AppConst.remoteServiceBaseUrl + 'DocumentDownload/' + file.id + `?docType=${file.docType}`
    if (this.data.name === 'Employee') {
      fileUrl = AppConst.remoteServiceBaseUrl + 'employee/download/' + file.id
    }
    this.httpClient.get(fileUrl, { responseType: 'blob' })
      .subscribe((event: any) => {
        console.log('download event: ', event);
        this.downloadFile(event, file);
      });
  }

 getFileNameFromHttpResponse(httpResponse) {
    const contentDispositionHeader = httpResponse.headers('Content-Disposition');
    const result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
    return result.replace(/"/g, '');
}

  private downloadFile(data: any, file: any) {
    let downloadedFile: Blob
    if (data instanceof Blob) {
      downloadedFile = data
    } else {
      downloadedFile = new Blob([data.body], { type: data.type });
    }
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = file.name + file.extension;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }
}




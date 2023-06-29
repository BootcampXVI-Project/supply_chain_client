import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { ManageAccountService } from './manage-account.service';
import { UserInfo } from '../../models/user-model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit{
  @ViewChild('accountPagination', {static: true}) accountPagination!: MatPaginator ;
  dataSourceAccount = new MatTableDataSource<any>()
  displayAccountColumns = ['index', 'avatar', 'fullname', 'email', 'phoneNumber', 'action']
  users: UserInfo[] = []

  constructor(
    private userService: UserService,
    private manageAccountService: ManageAccountService
  ) {
  }
  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.manageAccountService.getAllUsers().subscribe(
      response => {
        let data:any = response
        this.users = data.data
        console.log( "ACCOUNT",this.users);
        this.dataSourceAccount = new MatTableDataSource(this.users)
        this.dataSourceAccount.paginator = this.accountPagination
      }
    )
  }
}

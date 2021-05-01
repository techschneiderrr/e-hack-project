import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { WalletService } from '../../services/wallet/wallet.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-permission-request',
  templateUrl: './permission-request.component.html',
  styleUrls: ['./permission-request.component.scss']
})
export class PermissionRequestComponent implements OnInit, OnChanges {
  @Input() permissionRequest: any;
  @Output() permissionResponse = new EventEmitter();
  selectedAccount: string;
  constructor(
    public walletService: WalletService,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    if (this.walletService.wallet) {
      this.selectedAccount = this.walletService.wallet.implicitAccounts[0].address;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.permissionRequest) {
      const scrollBarWidth = window.innerWidth - document.body.offsetWidth;
      document.body.style.marginRight = scrollBarWidth.toString();
      document.body.style.overflow = 'hidden';
      this.messageService.removeBeaconMsg(true);
    }
  }
  rejectPermissions() {
    this.permissionResponse.emit(null);
    this.reset();
  }
  grantPermissions() {
    console.log(this.selectedAccount);
    const pk = this.walletService.wallet.getImplicitAccount(this.selectedAccount).pk;
    this.permissionResponse.emit(pk);
    this.reset();
  }
  reset() {
    document.body.style.marginRight = '';
    document.body.style.overflow = '';
    this.permissionRequest = null;
  }
  scopeToText(scope: string) {
    if (scope === 'sign') {
      return 'Request other signing';
    } else if (scope === 'operation_request') {
      return 'Request operation signing';
    }
    return scope;
  }
}

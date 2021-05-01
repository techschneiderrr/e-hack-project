import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WalletService } from '../../services/wallet/wallet.service';
import { HdWallet } from '../../services/wallet/wallet';
import { CoordinatorService } from '../../services/coordinator/coordinator.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-new-implicit',
  templateUrl: './new-implicit.component.html',
  styleUrls: ['./new-implicit.component.scss'],
})
export class NewImplicitComponent implements OnInit {
  @ViewChild('pwdInput') pwdView: ElementRef;
  modalOpen = false;
  password = '';
  errorMsg = '';
  modalRef1: BsModalRef;
  constructor(
    public walletService: WalletService,
    private coordinatorService: CoordinatorService,
    private modalService: BsModalService,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef
  ) {}
  openModal() {
    if (this.openPkhSpot()) {
      // hide body scrollbar
      const scrollBarWidth = window.innerWidth - document.body.offsetWidth;
      document.body.style.marginRight = scrollBarWidth.toString();
      document.body.style.overflow = 'hidden';
      this.clear();
      this.modalOpen = true;
      setTimeout(() => {
        const inputElem = <HTMLInputElement>this.pwdView.nativeElement;
        inputElem.focus();
      }, 100);
    } else {
      this.messageService.addWarning('Can\'t create additional accounts when an unused account already exists');
    }
  }
  closeModal() {
    // restore body scrollbar
    document.body.style.marginRight = '';
    document.body.style.overflow = '';
    this.clear();
    this.modalOpen = false;
  }
  ngOnInit(): void {}
  async addPkh() {
    if (this.openPkhSpot()) {
      this.messageService.startSpinner('Creating new account');
      const pkh = await this.walletService.incrementAccountIndex(this.password);
      if (pkh) {
        this.coordinatorService.start(pkh);
        this.closeModal();
      } else {
        this.errorMsg = 'Wrong password!';
      }
      this.messageService.stopSpinner();
    } else {
      console.log('blocked!');
    }
  }
  openPkhSpot(): boolean {
    const state: string = this.walletService.wallet.implicitAccounts[
      this.walletService.wallet.implicitAccounts.length - 1
    ].state;
    const balance: number = this.walletService.wallet.implicitAccounts[
      this.walletService.wallet.implicitAccounts.length - 1
    ].balanceXTZ;
    return (
      this.walletService.wallet instanceof HdWallet &&
      ( state.length > 0 || (balance !== null && balance > 0))
    );
  }
  clear() {
    this.password = '';
    this.errorMsg = '';
  }
}

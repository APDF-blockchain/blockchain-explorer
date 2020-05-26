import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-block-details-dialog',
  templateUrl: './block-details-dialog.component.html',
  styleUrls: ['./block-details-dialog.component.scss']
})
export class BlockDetailsDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public blockDetails: any) { }

}

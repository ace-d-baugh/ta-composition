// form-line-bid-rankcomponent.ts
// ======================================

// Import necessary modules and services
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineBidRank } from '../../../../interfaces/line-bid-rank';
import { Answer } from '../../../../interfaces/answers';
import { CdkDragDrop, DragRef, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import _ from 'lodash';
import { data } from './data/example-data';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NgIconsModule } from '@ng-icons/core';

@Component({
  selector: 'app-line-bids',
  standalone: true,
  imports: [CommonModule,DragDropModule, FormsModule, NgIconsModule],
  templateUrl: './line-bids.component.html',
  styleUrl: './line-bids.component.css'
})
export class LineBidsComponent implements OnInit {
  // Line bid rank variables
  public dragging?: DragRef<any>;
  public selections: LineBidRank[] = [];
  private currentSelectionSpan: number[] = [];
  private lastSingleSelection: number = -1;
  public periodsId: number = 0;
  public filteredLines: LineBidRank[] = [];
  public previouslySavedBidLines: LineBidRank[] = [];


  constructor(              
    private eRef: ElementRef,
    private cdRef: ChangeDetectorRef,
    private cookieService: CookieService,
) {}
    

  bidPoolLines: LineBidRank[] = [];
  savedBidLines: LineBidRank[] = [];
  searchTerm = '';
  emptySavedText = `Add Lines Here. Please select at least one line from below and add it here before submitting. You may click/tap on a line to select it.  You may also drag and drop one or more lines.`;
  emptyPoolText = `There doesn't seem to be an open bid at this time. If you feel this is an error, please contact your leader.`;
  noSearchResultsText = 'Nothing matches your search criteria. Please try again.';
  allSavedText = 'All lines have been selected and saved.';
  castName = 'Tom Davenport';
  castEmail = 'tomd@yahoo.com';
  component = {
    ComponentID: 0,
    ComponentName: '',
    Answers: [] as Answer[],
  }

  ngOnInit(): void {
    this.getData();

    // Check if user has visited before
    let visitedBefore = this.cookieService.get('visitedBefore');
    if (!visitedBefore) {
      // Show helper text on first visit
      this.toggleHelp();
      // Set cookie to mark as visited
      this.cookieService.set('visitedBefore', 'true', 365); // expires in 1 year
    }
	}
  
  getData(): void {
    this.bidPoolLines = data;
    this.bidPoolLines.forEach((line, index) => {
      line.isSelected = false;
      line.originalOrder = index;
      });
    this.filteredLines = this.bidPoolLines;
  }

  
  select(lines: LineBidRank[], line: any, event: MouseEvent, index: number) {
    const shiftSelect = event.shiftKey && 
      (this.lastSingleSelection || this.lastSingleSelection === 0) && 
      this.lastSingleSelection !== index; 

    if (!lines.includes(this.selections[0])) {
      this.clearSelection();
    }

    if (!this.selections || this.selections.length < 1) {
      this.selections.push(line);
      line.isSelected = true;
      this.lastSingleSelection = index;
    } else if (event.metaKey || event.ctrlKey) {
      if (line.isSelected) {
        this.selections = _.filter(this.selections, l => l !== line);
        line.isSelected = false;
        this.lastSingleSelection = -1;
      } else {
        this.selections.push(line);
        line.isSelected = true;
        this.lastSingleSelection = index;
        this.sortArray(this.selections);
      }
    } else if (shiftSelect) {
      const newSelectionBefore = index < this.lastSingleSelection;
      const count = (
        newSelectionBefore ? this.lastSingleSelection - (index - 1) :
        (index + 1) - this.lastSingleSelection
      );

      // Clear previous shift selection
      if (this.currentSelectionSpan && this.currentSelectionSpan.length > 0) {
        _.each(this.currentSelectionSpan, i => {
          this.selections = _.filter(this.selections, l => l !== line);
          line.isSelected = false;
        });
        this.selections = [];
        this.currentSelectionSpan = [];
      }

      // Build the new selection span
      _.times(count, c => {
        if (newSelectionBefore) {
          this.currentSelectionSpan.push(this.lastSingleSelection - c);
        } else {
          this.currentSelectionSpan.push(this.lastSingleSelection + c);
        }
      });

      _.each(this.currentSelectionSpan, (i) => {
        if (!_.includes(this.selections, lines[i])) {
          lines[i].isSelected = true;
          this.selections.push(lines[i]);
          this.sortArray(this.selections);
        }
      });
    } else {
      const alreadySelected = _.find(this.selections, s => s === line);
      if ((!alreadySelected && !event.shiftKey) ||
        (alreadySelected && this.selections.length > 1)) {
        this.deselectAllSavedLines();
        this.deselectAllVisibleLines();
        this.clearSelection();
        this.selections.push(line);
        line.isSelected = true;
        this.lastSingleSelection = index;
      } else if (alreadySelected) {
        this.clearSelection();
        line.isSelected = false;
      }
    }

    if (!event.shiftKey) {
      this.currentSelectionSpan = [];
    }
    this.cdRef.detectChanges();
  }

  // Function to clear the selection
  clearSelection() {
    if (this.selections.length) {
      this.selections = [];
      this.currentSelectionSpan = [];
      this.lastSingleSelection = -1;
      this.cdRef.detectChanges();
      this.filteredLines.forEach((line) => {
        line.isSelected = false;
      })
      this.savedBidLines.forEach((line) => {
        line.isSelected = false;
      })
    }
  }

  // Function to handle keyboard events
  @HostListener('document:keydown', ['$event'])
  private handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'a' &&
      (event.ctrlKey || event.metaKey) &&
      this.selections.length &&
      document.activeElement?.nodeName !== 'INPUT'
    ) {
      event.preventDefault();
      if (this.savedBidLines.includes(this.selections[0])) {
        this.selectAllSavedLines();
      } else {
        this.selectAllVisibleLines();
      }
    } else if (event.key === 'Escape' && this.dragging) {
      this.dragging.reset();
      document.dispatchEvent(new Event('mouseup'));
    }
  }

  // Function to handle clicks outside the component
  @HostListener('document:click', ['$event'])
  private clickout(event: MouseEvent) {
    if (this.selections.length && !this.eRef.nativeElement.contains(event.target)) {
      this.clearSelection();
    }
  }

  sortArray(arr: LineBidRank[]): LineBidRank[] {
    return arr.sort((a, b) => (a.originalOrder ?? Infinity) - (b.originalOrder ?? Infinity));
  }

  selectAllSavedLines(): void { 
    this.savedBidLines.forEach(line => {
      line.isSelected = true;
      this.selections.push(line);
    })
    this.filteredLines.forEach(line => {
      line.isSelected = false;
      this.selections = this.selections.filter(l => l !== line);
    });
  }

  deselectAllSavedLines(): void { 
    this.savedBidLines.forEach(line => {
      line.isSelected = false;
      this.selections = [];
    })
  }

  removeSavedLines(): void { 
    this.component.Answers = [];
    this.savedBidLines.forEach(line => {
      if (line.isSelected) {
        this.filteredLines.push(line);
        this.savedBidLines = this.savedBidLines.filter(l => l !== line);
      }
    })
    this.clearSelection();
    this.filteredLines = this.sortArray(this.filteredLines);

    // Add saved lines to Answers Array
    this.savedBidLines.forEach((line, index) => {
      this.component.Answers[index] = {
        FormSubmissionID: null,
        ComponentID: this.component.ComponentID ? this.component.ComponentID : null,
        AnswerID: null,
        Answer: line.Pattern,
        AnswerReferenceID: line.BidPatternInventoriesId,
        AnswerOrder: index
      };
    })

  }


  filterResults() {
    if (!this.filteredLines || this.searchTerm === '' && this.savedBidLines.length === 0) {
      this.filteredLines = this.bidPoolLines;
    } else {
      const searchTerms = this.searchTerm.toLowerCase().split(' ');
      this.filteredLines = this.bidPoolLines.filter(item => {
        const pattern = item.Pattern.toLowerCase();
        return searchTerms.every(term => pattern.includes(term));
      });
      this.filteredLines = this.filteredLines.filter(line => !this.savedBidLines.includes(line));
    }
  }
  clearSearch(): void { 
    if(this.searchTerm !== '') {
      this.searchTerm = '';
      // filtereLines is back to the original bidPoolLines minus what is in savedBidLines
      this.filteredLines = this.bidPoolLines.filter(line => !this.savedBidLines.includes(line));
      }
  }

  selectAllVisibleLines(): void {
    this.filteredLines.forEach(line => {
        line.isSelected = true;
        this.selections.push(line);
    });
    this.savedBidLines.forEach(line => {
      line.isSelected = false;
      this.selections = this.selections.filter(l => l !== line);
    })
  }

  deselectAllVisibleLines(): void { 
    this.filteredLines.forEach(line => line.isSelected = false);
    this.selections = [];
  }

  addPoolLinesToSaved(): void { 
    this.component.Answers = [];
    this.filteredLines.forEach(line => {
      if (line.isSelected) {
        this.savedBidLines.push(line);
        this.savedBidLines.forEach((line) => (line.isSelected = false));
        this.filteredLines = this.filteredLines.filter(l => l !== line);
      } 
    });
    this.filteredLines = this.sortArray(this.filteredLines);
    this.clearSelection();
    this.savedBidLines.forEach((line, index) => {
      this.component.Answers[index] = {
        FormSubmissionID: null,
        ComponentID: this.component.ComponentID ? this.component.ComponentID : null,
        AnswerID: null,
        Answer: line.Pattern,
        AnswerReferenceID: line.BidPatternInventoriesId,
        AnswerOrder: index
      };
    })
    this.closeHelp();
  }
  
    //**********
    // DRAG N DROP 
    //*********/

    drop(event: CdkDragDrop<LineBidRank[]>, bidLines: LineBidRank[]) {
      this.component.Answers = [];

      if (event.previousContainer === event.container && event.container.id ==='savedBidLines' && this.selections.length > 0) {
        this.savedBidLines = this.savedBidLines.filter(l => !this.selections.includes(l));
        this.filteredLines = this.filteredLines.filter(l => !this.selections.includes(l));
        this.savedBidLines.splice(event.currentIndex, 0, ...this.selections);
      } else if (event.previousContainer === event.container && event.container.id ==='savedBidLines' && this.selections.length === 0) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        )
      } else if (event.previousContainer !== event.container && event.container.id ==='savedBidLines' && this.selections.length > 0) {
        this.savedBidLines = this.savedBidLines.filter(l => !this.selections.includes(l));
        this.savedBidLines.splice(event.currentIndex, 0, ...this.selections); 
        this.filteredLines = this.filteredLines.filter(l => !this.selections.includes(l)); 
      } else if (event.previousContainer !== event.container && event.container.id ==='bidPoolLines' && this.selections.length > 0) {
        if (this.selections.every(l => this.filteredLines.includes(l))) {
          this.clearSelection();
        }
        this.filteredLines.splice(event.currentIndex, 0, ...this.selections);
        this.savedBidLines = this.savedBidLines.filter(l => !this.selections.includes(l));
      } else if (event.previousContainer !== event.container && event.container.id ==='bidPoolLines' && this.selections.length === 0
        || event.previousContainer !== event.container && event.container.id ==='savedBidLines' && this.selections.length === 0) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
      this.clearSelection();
      this.filteredLines = this.sortArray(this.filteredLines);

      this.savedBidLines.forEach((line, index) => {
        this.component.Answers[index] = {
          FormSubmissionID: null,
          ComponentID: this.component.ComponentID ? this.component.ComponentID : null,
          AnswerID: null,
          Answer: line.Pattern,
          AnswerReferenceID: line.BidPatternInventoriesId,
          AnswerOrder: index
        };
      })

      this.closeHelp();
  
    }

  toggleHelp(): void {
    const helper = document.getElementById('helper-text');
    if (helper) {
      helper.classList.toggle('show');
    }
  }

  closeHelp(): void {
    const helper = document.getElementById('helper-text');
    if (helper) {
      helper.classList.remove('show');
    }
  }
}


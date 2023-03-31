import { ChangeDetectorRef, Component, Inject, Injector, OnInit, Optional, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { MatCheckboxChange} from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { finalize, take } from 'rxjs/operators';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { IRoleClaim} from '../../model/IRoleClaim';
import { IRoleModel} from '../../model/IRoleModel';
import { AccessManagementService } from '../../service/access-management.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  value: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  type: string;
  value: string;
  viewValue: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'kt-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})

export class CreateRoleComponent extends AppComponentBase implements OnInit{

  searchText: string
  currentIndex = 0
  appConsts = AppConst
  roleForm: FormGroup
  roleModel: IRoleModel
  roleClaims: IRoleClaim[] = []
  permissions = Permissions
  //title name
  titleName: string = "Create Role ";

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  //show Buttons
  showButtons: boolean = true;

  //Hide Submit And Cancel button
  isEditButtonShow: boolean = false;

  //Store tree view data
  dataChange = new BehaviorSubject<any[]>([]);

  isLoading: boolean
  // validation messages
  validationMessages = {
    roleName: {
      required: 'Role Name is required.',
    },
  };
  // keys for validation
  formErrors = {
    roleName: '',
  };

  constructor(
    private accessManagementService: AccessManagementService,
    @Optional() @Inject(MAT_DIALOG_DATA) readonly _id: any,
    public dialogRef: MatDialogRef<CreateRoleComponent>,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    injector: Injector
  ) {
    super(injector);
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.dataChange.subscribe((data: any) => {
      this.dataSource.data = data;
    });
  }

  initialize() {

    //Excluding Delete permissions from claims
    this.roleClaims.map((claim: IRoleClaim, i: number) => {
      if(claim.value.toLowerCase().includes('delete')){
         this.roleClaims.splice(i , 1)
      }
      return claim
    })

    /**Spliting every permissions in permissions array to get module name and group permissions module wise */

    let groupByPerms = this.groupBy(this.roleClaims, value => value.value.split('.')[0])

    //Passing Group data in buildFileTree function to get tree view
    const data = this.buildFileTree(Object.fromEntries(groupByPerms), 0);

    //Notify the change.
    this.dataChange.next(data);

    //check all selected items in roles
    if(this._id) {
      this.checkAll()
    }
  }


  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);


  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.value === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.value === node.value ? existingNode : new TodoItemFlatNode();
    flatNode.value = node.value;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };


  ngOnInit() {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required]
    });

    if (this._id) {
      this.showButtons = (this.permission.isGranted(this.permissions.AUTH_EDIT)) ? true : false;
      // this.isEditButtonShow = true;
      this.titleName = 'Edit Role';
      this.isLoading = true;
      this.getRoleById(this._id);
    } else {
      this.getClaims();
      this.roleModel = {
        id: null,
        roleName: '',
        roleClaims: []
      }
    }
  }

  getRoleById(id: any) {
    this.accessManagementService.getRole(id)
    .pipe(
      take(1),
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
    )
    .subscribe((arg) => {
      this.roleModel = arg.result;
      this.patchRole(this.roleModel);
    });
  }

  patchRole(roleModel: IRoleModel) {
    this.roleForm.patchValue({
      roleName: roleModel.roleName,
    })

    this.roleClaims = roleModel.roleClaims.map(x => {
      x.viewValue = this.appConsts.PermissionsDisplayName[x.value]
      return x;
    });
    this.roleModel.id = this._id;

    //Calling Grouping Functionality Module Wise
    this.initialize()

    if(!this.showButtons) this.roleForm.disable()
  }


  onSubmit() {

    if (this.roleForm.invalid) {
      this.currentIndex = 0;
      return
    }

    let roles = [];
    this.treeControl.dataNodes.map((res) => {
     if(res.level === 1) {
       if(this.checklistSelection.isSelected(res)){
         res.value['selected'] = true;
       }
       else{
         res.value['selected'] = false;
       }
       roles.push(res.value)
     }
    })

    if (roles.filter(x => x.selected === true).length < 2) {
      this.toastService.warning('Atleast 2 Permissions is required !', 'Role');
      this.currentIndex = 1;
      return
    }

    this.isLoading = true;
    this.roleModel = {...this.roleForm.value, id: this._id};
    this.roleModel.roleClaims = roles;

    if (this.roleModel.id) {
      this.accessManagementService.updateRole(this.roleModel)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.toastService.success('Updated Successfully', this.roleModel.roleName + '');
        this.onRoleDialogClose();
      })
    } else {
      this.accessManagementService.createRole(this.roleModel)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.toastService.success('Created Successfully', 'New Role');
        this.onRoleDialogClose();
      })
    }
  }

  onRoleDialogClose() {
    this.dialogRef.close();
  }

  getClaims() {
    this.accessManagementService.getClaims().subscribe((res) => {
      res.result.forEach(element => {
        console.log(element)
        console.log(this.appConsts.PermissionsDisplayName[element])
        this.roleClaims.push(
          {
            type: 'permission',
            value: element,
            selected: false,
            viewValue: this.appConsts.PermissionsDisplayName[element]
          })
      });

      //Calling Grouping Functionality Module Wise
      this.initialize()
    })
  }

  reset() {
    this.formDirective.resetForm();
    this.roleClaims = [];
    this.getClaims();
  }

  onPermissionChange(permission: IRoleClaim, $event: MatCheckboxChange) {
    this.roleClaims[this.roleClaims.indexOf(permission)].selected = $event.checked
  }


  //Manage Grouping
  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
   buildFileTree(obj: any, level: number): TodoItemNode[] {

    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {

      const value = obj[key];
      const node = new TodoItemNode();

      node.value = (key === 'AccessManagement') ? 'Access Management': key;

      if (value != null) {
        if (typeof value === 'object' && value.type?.toLowerCase() !== 'permission') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.value = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  //check all permissions
  checkAll(){
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
    if(this.treeControl.dataNodes[i].value['selected']) {
        this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
        this.checkAllParentsSelection(this.treeControl.dataNodes[i])
      //this.treeControl.expand(this.treeControl.dataNodes[i])
    }
   }
  }
}

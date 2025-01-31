import { Injectable } from "@angular/core";

import { OrganizationService } from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";

import { ApItemValueType } from "./models/ap-item-value.type";
import { ApItemEnum } from "./models/enums/ap-item.enum";
import { ApPermissionEnum } from "./models/enums/ap-permission.enum";

@Injectable({
  providedIn: "root",
})
export class AccessPolicySelectorService {
  constructor(private organizationService: OrganizationService) {}

  async showAccessRemovalWarning(
    organizationId: string,
    selectedPoliciesValues: ApItemValueType[]
  ): Promise<boolean> {
    const organization = this.organizationService.get(organizationId);
    if (organization.isOwner || organization.isAdmin) {
      return false;
    }

    const selectedUserReadWritePolicy = selectedPoliciesValues.find(
      (s) =>
        s.type === ApItemEnum.User &&
        s.currentUser &&
        s.permission === ApPermissionEnum.CanReadWrite
    );

    const selectedGroupReadWritePolicies = selectedPoliciesValues.filter(
      (s) =>
        s.type === ApItemEnum.Group &&
        s.permission == ApPermissionEnum.CanReadWrite &&
        s.currentUserInGroup
    );

    if (selectedGroupReadWritePolicies == null || selectedGroupReadWritePolicies.length == 0) {
      if (selectedUserReadWritePolicy == null) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  }
}

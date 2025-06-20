import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export function createAbilityFromPermissions(permissions: string[]) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  permissions.forEach((permission) => {
    can(permission, '');
  });

  return build();
}

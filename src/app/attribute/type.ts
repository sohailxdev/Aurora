interface AttributeKey {
  id: string;
  attributeName: string;
  attributeType: string;
  inputType: string | null;
  values: string[];
}

export interface attributeType {
  id: string;
  attributeKey: AttributeKey;
  value: string[];
  groupCompanyId: string;
}

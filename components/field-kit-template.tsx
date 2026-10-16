import { fieldKitCategories, publishableFieldKitItems } from "@/lib/field-kit";
export function FieldKitTemplate({ items }: { items: unknown[] }) {
 const verified = publishableFieldKitItems(items);
 return <div className="container-wide field-kit-template">{fieldKitCategories.map(category=>{
  const entries=verified.filter(item=>item.category===category.id);
  if (!entries.length) return null;
  return <section key={category.id}><h2>{category.title}</h2><p>{category.description}</p>{entries.map(item=><article key={item.id}><h3>{item.name}</h3>{item.description&&<p>{item.description}</p>}{item.designations.length>0&&<ul>{item.designations.map(d=><li key={d.label}>{d.label}</li>)}</ul>}{item.companyRelationship&&<p>{item.companyRelationship.type}: {item.companyRelationship.company}</p>}</article>)}</section>;
 })}</div>;
}

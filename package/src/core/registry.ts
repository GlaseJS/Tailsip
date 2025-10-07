

class Registry
{
  private components: { [x: string]: Component[] } = {};
  
  Register(component: Component)
  {
    if (!(component.type in this.components))
      this.components[component.type] = [];

    if (!this.components[component.type].includes(component))
      this.components[component.type].push(component);
  }

  GetAllOfType<T extends Component = Component>(type: string)
  {
    return (this.components[type] ?? []) as T[];
  }
}

declare global { var $registry: Registry }
$globalize("$registry", new Registry());
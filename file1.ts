  ngOnInit(): void {
    this.drawOrgChart();
  }

  private drawOrgChart(): void {
    const data = {
      name: "CEO",
      children: [
        { name: "Directeur Technique", children: [
          { name: "Équipe Dev", children: [] },
          { name: "Équipe QA", children: [] }
        ]},
        { name: "Directeur Marketing", children: [
          { name: "Équipe Communication", children: [] },
          { name: "Équipe Ventes", children: [] }
        ]}
      ]
    };

    const margin = {top: 20, right: 90, bottom: 30, left: 90};
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(this.el.nativeElement).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([height, width]);
    treeLayout(root);

    svg.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
        .x(d => (d as any).y)
        .y(d => (d as any).x));

    const node = svg.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
      .attr("r", 10);

    node.append("text")
      .attr("dy", ".35em")
      .attr("y", d => d.children ? -20 : 20)
      .style("text-anchor", "middle")
      .text(d => d.data.name);
  }

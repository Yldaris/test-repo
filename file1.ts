import { Component, OnInit, ElementRef } from '@angular/core';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';

@Component({
  selector: 'app-organigramme',
  templateUrl: './organigramme.component.html',
  styleUrls: ['./organigramme.component.css']
})
export class OrganigrammeComponent implements OnInit {

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.drawOrgChart();
  }

  private drawOrgChart(): void {
    // Données hiérarchiques pour l'organigramme
    const data = {
      name: "CEO",
      children: [
        { name: "Directeur Technique", children: [
          { name: "Équipe Dev", value: 5 },
          { name: "Équipe QA", value: 3 }
        ]},
        { name: "Directeur Marketing", children: [
          { name: "Équipe Communication", value: 4 },
          { name: "Équipe Ventes", value: 6 }
        ]}
      ]
    };

    // Création de la hiérarchie D3
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([500, 400]);
    treeLayout(root);

    // Création du SVG
    const svg = d3.select(this.el.nativeElement)
      .append("svg")
      .attr("width", 600)
      .attr("height", 500)
      .attr("viewBox", [-100, -20, 600, 500]);

    // Dessin des liens
    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", d3.linkHorizontal()
        .x(d => (d as any).y)
        .y(d => (d as any).x));

    // Dessin des nœuds
    const node = svg.append("g")
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
      .attr("r", 10)
      .attr("fill", d => d.children ? "#555" : "#999");

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -12 : 12)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .clone(true).lower()
      .attr("stroke", "white");
  }
}

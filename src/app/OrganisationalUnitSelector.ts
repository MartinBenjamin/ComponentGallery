import { Component, ElementRef, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from './Dialog';
import { OrganisationalUnit } from './OrganisationalUnit';

declare var d3: any;

type Callback<T> = (t: T) => void;

var margin = { top: 20, right: 20, bottom: 20, left: 20 };

function name(
    d
    )
{
    return d.Acronym;
}

function diagonal(
    d
    )
{
    return 'M' + d.source.y + ',' + d.source.x
        + 'H' + (d.target.y + d.source.y) / 2
        + 'V' + d.target.x
        + 'H' + d.target.y;
}

export interface OrganisationalUnitSelectorConfiguration
{
    Selectable: (organisationalUnit: OrganisationalUnit) => boolean;
    Collapsed : (organisationalUnit: OrganisationalUnit) => boolean;
}

@Component(
    {
        selector: 'dt-organisational-unit-selector',
        template: '\
<dt-dialog\
    [Title]="Title"\
    [Open]="Callback">\
    <dt-dialog-body><dt-organisational-unit-container\
        [Hierarchy]="Hierarchy"\
        [Callback]="Callback"></dt-organisational-unit-container></dt-dialog-body>\
    <dt-dialog-buttons><input type="Button" value="Close" (click)="Cancel()" class="Button"></dt-dialog-buttons>\
</dt-dialog>'
    })
export class OrganisationalUnitSelector
{
    private static _defaultConfiguration = <OrganisationalUnitSelectorConfiguration>
    {
        Selectable: () => true,
        Collapsed : () => false
    };

    private _hierarchy: OrganisationalUnit;
    private _callback: Callback<OrganisationalUnit>;

    @Input()
    Title: string = 'Select Organisational Unit'

    @Input()
    Configuration = OrganisationalUnitSelector._defaultConfiguration;

    @Output()
    Oncancel = new EventEmitter<void>();

    constructor()
    {
    }

    @Input()
    set Hierarchy(
        hierarchy: OrganisationalUnit
    )
    {
        this._hierarchy = hierarchy;
    }

    get Hierarchy(): OrganisationalUnit
    {
        return this._hierarchy;
    }

    Select(
        callback: Callback<OrganisationalUnit>
        ): void
    {
        this._callback = callback;
    }

    get Callback(): Callback<OrganisationalUnit>
    {
        return this._callback;
    }

    Close(): void
    {
        this._callback = null;
    }

    Cancel(): void
    {
        this.Close();
        this.Oncancel.emit();
    }
}

@Component(
    {
        selector: 'dt-organisational-unit-container',
        template: '\
<div></div>'
    })
export class OrganisationalUnitContainer
{
    private _hierarchy: OrganisationalUnit;
    private _callback : Callback<OrganisationalUnit>;

    constructor(
        private _selector: OrganisationalUnitSelector,
        private _el      : ElementRef
        )
    {
    }

    @Input()
    set Hierarchy(
        hierarchy: OrganisationalUnit
        )
    {
        this._hierarchy = hierarchy;
    }

    @Input()
    set Callback(
        callback: Callback<OrganisationalUnit>
        )
    {
        this._callback = callback;

        if(callback)
            this.Initialise();
    }

    private Initialise(): void
    {
        let duration = 750,
            root;

        let tree = d3.layout.tree()
            .children(
                function(
                    d
                    )
                {
                    return d.hideChildren ? null : d.Children;
                })
            .sort(
                function(
                    x,
                    y
                    )
                {
                    if(name(x) < name(y))
                        return -1;
                    if(name(x) > name(y))
                        return 1;
                    return 0;
                })
            .nodeSize([40, 40]);

        let div = <HTMLDivElement>this._el.nativeElement.firstChild;
        while(div.childNodes.length)
            div.removeChild(div.firstChild);

        let svg = d3.select(div).append('svg');
        let g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        root = this._hierarchy;
        root.x0 = 0;
        root.y0 = 0;

        tree.nodes(root).forEach(node => node.hideChildren = this._selector.Configuration.Collapsed(node));

        let component = this;

        function update(
            source: any
            )
        {
            // Compute the new tree layout.
            let nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(d => d.y = d.depth * 140);

            // Update the nodes.
            let node = g.selectAll('g.node')
                .data(nodes, d => d.Id);

            // Enter any new nodes at the parent's previous position.
            let nodeEnter = node.enter().append('g')
                .classed('node', true)
                .attr('transform', d => 'translate(' + source.y0 + ',' + source.x0 + ') scale(1e-6)');

            let group = nodeEnter.append('g');

            group.append('circle')
                .attr('r', 10);

            let parent = group.filter(d => d.Children.length);

            parent.classed('parent', true)
                .on('click', d =>
                {
                    d.hideChildren = !d.hideChildren;
                    update(d);
                });

            parent.append('line')
                .attr('x1', '-5')
                .attr('y1', '0')
                .attr('x2', '5')
                .attr('y2', '0');

            parent.append('line')
                .attr('x1', '0')
                .attr('y1', '-5')
                .attr('x2', '0')
                .attr('y2', '+5')
                .attr('class', 'vertical');

            nodeEnter.filter(d => component._selector.Configuration.Selectable(d))
                .append('a')
                .append('text')
                .attr('y', 20)
                .attr('dy', '.35em')
                .attr('text-anchor', 'middle')
                .style('fill-opacity', 1e-6)
                .text(name)
                .on('click', d =>
                {
                    component._callback(d);
                    component._selector.Close();
                });

            nodeEnter.filter(d => !component._selector.Configuration.Selectable(d))
                .append('text')
                .attr('y', 20)
                .attr('dy', '.35em')
                .attr('text-anchor', 'middle')
                .style(
                {
                    'fill-opacity': 1e-6,
                    cursor: 'default',
                    fill: '#999'
                })
                .text(name);

            node.classed('expanded', d => !d.hideChildren);

            // Transition nodes to their new position.
            let gElement = <SVGGElement>g[0][0];
            svg.transition()
                .duration(duration)
                .attrTween(
                'height',
                () => () => gElement.getBBox().height + margin.top + margin.bottom)
                .attrTween(
                'width',
                () => () => gElement.getBBox().width + margin.left + margin.right);

            g.transition()
                .duration(duration)
                .attrTween(
                'transform',
                () => () =>
                {
                    let bbox = gElement.getBBox();
                    return 'translate(' + (margin.left - bbox.x) + ',' + (margin.top - bbox.y) + ')';
                });

            let nodeUpdate = node.transition()
                .duration(duration)
                .attr('transform', d => 'translate(' + d.y + ',' + d.x + ') scale(1)');

            nodeUpdate.select('text')
                .style('fill-opacity', 1);

            // Transitlon exiting nodes to the parent's new position.
            let nodeExit = node.exit().transition()
                .duration(duration)
                .attr('transform', d => 'translate(' + source.y + ',' + source.x + ') scale(1e-6)')
                .remove();

            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // Update the links.
            let link = g.selectAll('path.link')
                .data(links, d => d.target.Id);

            // Enter any new links at the parent's previous position.
            link.enter().insert('path', 'g')
                .attr('class', 'link')
                .attr('d', d =>
                {
                    let o = { x: source.x0, y: source.y0 };
                    return diagonal({ source: o, target: o });
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr('d', diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr('d', d =>
                {
                    let o = { x: source.x, y: source.y };
                    return diagonal({ source: o, target: o });
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(d =>
            {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        update(root);
    }
}

@NgModule(
    {
        imports:
        [
            CommonModule,
            DialogModule
        ],
        declarations:
        [
            OrganisationalUnitSelector,
            OrganisationalUnitContainer
        ],
        exports:
        [
            OrganisationalUnitSelector
        ]
    })
export class OrganisationalUnitSelectorModule
{ }

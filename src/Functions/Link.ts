export interface Metadata {
  row: number;
  column: number;
}

export class Link {
  public top: Link;
  public bottom: Link;
  public left: Link;
  public right: Link;

  public header: HeaderLink;
  public metadata: Metadata;

  constructor(header?: HeaderLink, metadata?: Metadata) {
    this.top = this;
    this.bottom = this;
    this.left = this;
    this.right = this;

    if (metadata) {
      this.metadata = metadata;
    }

    if (header) {
      this.header = header;
    }
  }

  public linkBottom(link: Link): Link {
    link.bottom = this.bottom;
    link.bottom.top = link;
    link.top = this;

    this.bottom = link;
    this.header.size++;
    return this;
  }

  public linkRight(link: Link): Link {
    link.right = this.right;
    link.right.left = link;
    link.left = this;

    this.right = link;
    return this;
  }

  public detachLeftRight(): Link {
    this.left.right = this.right;
    this.right.left = this.left;
    return this;
  }

  public detachTopBottom(): Link {
    this.top.bottom = this.bottom;
    this.bottom.top = this.top;
    return this;
  }

  public reattachLeftRight(): Link {
    this.left.right = this;
    this.right.left = this;
    return this;
  }

  public reattachTopBottom(): Link {
    this.top.bottom = this;
    this.bottom.top = this;
    return this;
  }
}

export class HeaderLink extends Link {
  public size: number;
  public left: HeaderLink;
  public right: HeaderLink;

  constructor() {
    super();
    this.header = this;
    this.size = 0;
  }

  public cover(): Link {
    this.detachLeftRight();

    for (let row = this.bottom; row !== this; row = row.bottom) {
      for (let column = row.right; column !== row; column = column.right) {
        column.detachTopBottom();
        column.header.size--;
      }
    }

    return this;
  }

  public uncover(): Link {
    for (let row = this.top; row !== this; row = row.top) {
      for (let column = row.left; column !== row; column = column.left) {
        column.header.size++;
        column.reattachTopBottom();
      }
    }

    this.reattachLeftRight();
    return this;
  }
}

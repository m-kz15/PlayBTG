function  arc_within(other, distance,angle){
	if (distance == null) {
		distance = (this.width + this.height + other.width + other.height) / 4;
	}
	var rag = Math.atan(Math.abs((this.y+(this.height/2))-(other.y+(other.height/2)))/Math.abs((this.x+(this.width/2))-(other.x+(other.width/2))));
	var rot = Math.abs(rag*180/Math.PI - 90);
	return (this.within(other,200) && rot > (other.rotation - angle) && rot < (other.rotation + angle));
}

enchant.Entity.prototype.arc_within = arc_within;
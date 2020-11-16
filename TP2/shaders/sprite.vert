attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float size_c;
uniform float size_l;
uniform float c;
uniform float l;


varying vec2 vTextureCoord;

void main() {

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vec2 div = vec2(1.0/size_c,1.0/size_l);
	vec2 selected = vec2(c/size_c,l/size_l);
	vTextureCoord = (aTextureCoord* div)+selected;    

}
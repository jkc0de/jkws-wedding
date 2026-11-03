"use client";

import { useActionState } from "react";
import { Loader2Icon } from "lucide-react";
import { login, type LoginState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <Card className="mx-auto max-w-sm border-border/80">
      <CardHeader>
        <CardTitle className="font-serif text-2xl font-light">Admin</CardTitle>
        <CardDescription>Enter the admin password to view RSVPs.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoFocus autoComplete="current-password" />
            {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          </div>
          <Button type="submit" disabled={pending} className="w-full rounded-full">
            {pending ? <Loader2Icon className="size-4 animate-spin" /> : null}
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
